# Research — Fase 0

Investigación previa a construir nada de storefront. Dos preguntas centrales:

1. ¿Dropi Chile tiene API/webhooks de estado de entrega o un conector
   Shopify oficial?
2. ¿Cómo interpretar correctamente la Meta Ad Library para research de
   productos, sin caer en un dato engañoso?

## 1. Integración Dropi ↔ Shopify

### Conector oficial: sí existe, se llama "Dropify"

Dropi tiene una app oficial en la Shopify App Store — **Dropify** (también
listada como "Dropify PRO") — que hace la sincronización sin necesidad de
que tú escribas código de integración:

- El cliente compra en tu tienda Shopify.
- El pedido se replica automáticamente en Dropi.
- El proveedor (en nuestro caso, Vida y Hogar SPA) despacha.
- El estado de la guía/envío se refleja de vuelta hacia Shopify.
- La sincronización de pedidos, inventario y tracking corre en un ciclo
  aproximado de **cada 5–10 minutos** (no es push instantáneo tipo webhook
  de Shopify nativo).

Setup (resumen, se detalla con capturas y pasos exactos en
`playbook/01-setup-inicial.md` cuando lleguemos a Fase 1):

1. En el panel de Dropi: "Mis Integraciones" → agregar integración Shopify
   → copiar el **token único** de integración.
2. Instalar la app **Dropify** desde el Shopify App Store.
3. Pegar el token de Dropi dentro de Dropify y verificar la conexión.
4. Otorgar permisos de dominio/tienda que pida la app.

### ¿Hay webhooks reales de cambio de estado?

**Con matices.** Lo que se confirma:

- Dropi expone una **API de integraciones propia** (no es OAuth público
  self-serve): el header de autenticación es `dropi-integration-key`, y
  cubre servicios como login, creación de pedido y obtención de guía
  (tracking). Es decir, técnicamente sí hay una API con la que un backend
  propio (por ejemplo, un workflow en el n8n del VPS) podría consultar
  estado de pedidos.
- Para acceder a esa API se debe **pedir acceso al equipo de TI de Dropi**,
  entregando: dominio de la plataforma a integrar, la(s) IP(s) desde donde
  se van a consumir los servicios, y datos para crear una cuenta de prueba.
  No es un API key que se autogenera libremente desde el dashboard sin
  pedirlo.
- No encontramos evidencia pública de que Dropi ofrezca **webhooks salientes
  reales** (push) hacia una URL propia cuando cambia el estado de una guía.
  Lo que existe y está confirmado es la sincronización periódica (polling)
  que hace la app Dropify hacia Shopify cada 5–10 minutos.
- Reporte recurrente de usuarios (foros/comunidades de n8n e integradores):
  el estado "completado" de una orden en Shopify **no se traduce 1:1**
  al estado logístico real en Dropi (ej. "en ruta", "entregado",
  "devuelto"). Para tener el estado logístico fino (el que de verdad
  importa para el principio COD: entregado y cobrado vs. rechazado) hay que
  mirar directamente el panel/API de Dropi, no asumir que el estado de
  Shopify ya lo refleja.

**Conclusión práctica para este proyecto:**

- Para Fase 1 (lanzar y vender), **Dropify es suficiente**: conecta pedidos
  e inventario sin trabajo de desarrollo.
- Para Fase 2 (ROAS efectivo real, dashboard), **no confiar en el estado de
  Shopify como fuente de verdad de entrega**. Hay que ir a la fuente: panel
  de Dropi (o su API de integraciones, pidiendo acceso formalmente) para
  saber qué pedidos se entregaron y cobraron de verdad.

### Plan B: CSV del panel de Dropi

Si en Fase 2 pedir acceso a la API de integraciones toma tiempo o no se
aprueba a tiempo, el plan B (siempre disponible, sin depender de nadie) es:

1. Exportar periódicamente el CSV de pedidos desde el panel web de Dropi
   (incluye estado de cada guía: creado, en tránsito, entregado, devuelto,
   novedad).
2. Importar ese CSV a la base/hoja que se use para calcular métricas reales
   (delivery rate, CPA real por pedido entregado, margen neto).
3. Cruzar por número de pedido/guía contra los pedidos de Shopify y el
   gasto de Meta Ads del mismo período.

Esto es manual pero **cero riesgo de bloqueo por permisos de API**, y es
suficientemente bueno para operar con volumen bajo/medio. Se automatiza
recién en Fase 2 si el volumen lo justifica (ver `TODO.md`).

### Transportadoras y comisión (contexto para la calculadora de márgenes)

- Dropi Chile despacha con **Chilexpress, Starken, Correos Chile y Blue
  Express**, dependiendo del producto/zona.
- Dropi cobra una **comisión reportada de ~5% sobre el precio de venta**,
  descontada del wallet al confirmarse la entrega (algunos programas de
  mentoría afirman poder eliminar esta comisión — no confirmado de forma
  oficial, no asumir sin verificar en tu propia cuenta).
- El **costo de envío (flete) es variable**: depende de peso, dimensiones,
  origen y destino del pedido. **No hay una tarifa plana pública** — hay que
  revisarla en el panel de Dropi para el producto específico (compresor de
  aire) y la comuna/región de destino promedio de tus pedidos.
- Retiro de fondos: transferencia a cuenta bancaria chilena (Banco de Chile
  o BancoEstado), 1–3 días hábiles.

**Importante:** los valores de envío y comisión en
`config/producto-actual.json` (`supuestosLogisticos`) son **estimaciones de
partida**, marcadas explícitamente como tal, para poder correr la
calculadora de margen antes de tener el dato real. Hay que reemplazarlas
por las cifras reales de tu panel Dropi antes de tomar decisiones de
presupuesto con el resultado.

## 2. Meta Ad Library — cómo NO malinterpretarla

Esto es para el futuro research-radar (Fase 2) y para cuando uses la
biblioteca manualmente para espiar competencia en Fase 1. Documentado ahora
para que quede fijado en el proyecto y nadie construya una automatización
sobre un dato equivocado.

- La **API oficial de Meta Ad Library** (Meta Ad Library API /
  Facebook Ads Library API) **solo cubre anuncios de temas
  políticos/electorales y "issues" sociales**. No expone datos de anuncios
  comerciales genéricos (como los de un producto de dropshipping) vía API.
  Para research de productos comerciales no hay atajo de API: se usa la
  interfaz web de la biblioteca de anuncios manualmente.
- La **interfaz web** de la biblioteca sí deja ver anuncios comerciales
  activos de cualquier página. El problema es un dato específico que
  Meta empezó a mostrar ahí: un **contador de "impresiones"** (o rango de
  impresiones) para ciertos anuncios.
- Ese contador de impresiones **es un requisito de transparencia de la Ley
  de Servicios Digitales (DSA) de la Unión Europea**. Existe porque Meta
  está obligado a reportarlo para anuncios con alcance en la UE — **mide
  actividad/impresiones en la UE**, no en Chile ni Latinoamérica.
- **Consecuencia práctica: ese número NO sirve como proxy de qué tan bien
  le está yendo a un anunciante en Chile.** Un anuncio puede mostrar pocas
  o cero impresiones "DSA" y estar arrasando en Chile, o viceversa. **No
  usar este número para decidir si un producto es ganador.**

### Señales válidas para sospechar "posible producto ganador"

En vez del contador de impresiones, las señales que sí son razonablemente
confiables (indirectas, pero prácticas):

1. **Días corriendo el mismo anuncio, sin pausar**: la biblioteca muestra
   la fecha de inicio de cada anuncio activo. Si un anunciante mantiene el
   mismo anuncio activo **5–7 días o más**, es una señal de que no está
   perdiendo plata con él (nadie sostiene gasto en un anuncio que pierde
   dinero por una semana).
2. **Número de variaciones activas** del mismo anunciante para el mismo
   producto/oferta (distintos hooks, imágenes, videos corriendo en
   paralelo): indica que están en fase de **escalar** (probar creativos
   nuevos sobre una base que ya funciona), no solo testeando por primera
   vez.

Ambas señales se combinan: un anunciante con un anuncio corriendo 10+ días
Y 4-5 variaciones activas del mismo producto es una señal fuerte. Un solo
anuncio recién publicado no dice nada todavía.

Esto queda anotado para retomarlo en el research-radar de Fase 2
(`TODO.md`); en Fase 1 se usa de forma manual si el operador quiere revisar
competencia antes de lanzar.

## Fuentes consultadas

- [Dropify - Import products from Dropi and Sync Orders (Shopify App Store)](https://apps.shopify.com/dropify-5)
- [Dropify PRO - Shopify App Store](https://apps.shopify.com/dropi-pro)
- [Conectar Dropi con Shopify 2026: Tutorial Paso a Paso — Andrey Business](https://www.andreybusiness.com/blog/conectar-dropi-con-shopify-2026-tutorial-completo-con-dropify)
- [Cómo Integrar Shopify con Dropi: Guía Paso a Paso - Ciborg](https://ciborg.cl/blog/como-integrar-shopify-con-dropi-guia-paso-a-paso/)
- [Dropshipping en Chile 2026 — Dropi Blog](https://dropi.cl/blog/dropshipping-chile/)
- [Integraciones - Dropi.co](https://dropi.co/integraciones/)
- [Tarifas Dropi: Calcula Costos y Rentabilidad — Andrey Business](https://www.andreybusiness.com/blog/tarifas-dropi-calcular-costos-rentabilidad-dropshipping-2026)
- [Documentación API de Dropi (Scribd)](https://es.scribd.com/document/683043719/Documentacion-de-Dropi-docx-7)
- [Documentación API de Integraciones Dropi (Scribd)](https://es.scribd.com/document/804372978/Integrations-Core-Dropi-2)
