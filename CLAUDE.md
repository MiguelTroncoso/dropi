# Contexto del proyecto — Dropi + Shopify Chile (COD)

> Este archivo (y su gemelo `AGENTS.md`, mismo contenido) existe para que el
> contexto del negocio persista entre sesiones de trabajo con Claude Code.
> Léelo completo antes de tocar código en este repo.

## Qué es este repo

Monorepo TypeScript para lanzar y validar, **por fases**, un negocio de
dropshipping local en **Chile** con **Dropi** (fulfillment + pago contra
entrega) y **Shopify** (tienda/hosting), validando productos con **Facebook
Ads**. El operador (dueño de este repo) es desarrollador Node/React/TS,
cómodo en CLI/Docker, pero **principiante en ads y dropshipping**.

No se está construyendo un dashboard ni automatización de métricas todavía
(eso es Fase 2, ver `TODO.md`). El objetivo inmediato es lanzar y validar UN
producto.

## Principio COD (nunca lo olvides)

**La rentabilidad se mide sobre pedidos ENTREGADOS y cobrados, no sobre
pedidos creados.** En pago contra entrega (COD) una parte de los pedidos se
rechaza o no se puede entregar (el comprador no contesta, cambia de opinión,
no tiene el dinero, etc.). Un producto que "vende mucho" (muchos pedidos
creados) pero con alta tasa de rechazo puede ser una pérdida neta, porque:

- El costo del producto y el envío de ida ya se gastaron al despachar.
- Si el pedido se rechaza, muchas veces hay un costo de envío de vuelta.
- El gasto publicitario (CPA) se paga por cada pedido CREADO, se entregue o
  no.

Cualquier cálculo de rentabilidad, copy, o mecánica de campaña en este repo
debe razonar en términos de **pedidos entregados**, no de "ventas" o
"pedidos" a secas. La calculadora de márgenes (`docs/calculadora-margen.md`
y `packages/calc-margen`) modela esto explícitamente.

## Stack / entorno real

- **Shopify**: tienda y hosting del storefront. No se necesita hosting
  aparte para lo que ve el cliente. Solo se apunta un dominio comprado por
  el operador.
- **Dropi**: proveedor/fulfillment local en Chile, pago contra entrega.
  El operador ya tiene cuenta Dropi.
- **VPS propio con Docker + n8n**: para todo lo que corra fuera de Shopify
  (automatizaciones, webhooks intermedios, futura Fase 2).
- **Idioma**: todo lo de cara al cliente (storefront, guías, copies) va en
  **español de Chile**.

## Producto piloto a validar (Producto #1)

| Campo | Valor |
|---|---|
| Producto | Compresor Digital Inflador de Aire |
| Proveedor Dropi | Vida y Hogar SPA |
| Costo Dropi (costo base) | $7.500 CLP |
| Stock disponible | 994 unidades |
| Precio de venta objetivo | $29.990 CLP |
| CPA objetivo original (operador) | Bajo $7.000 CLP |
| CPA máximo viable real (calculadora, envío Blue Express real) | ~$6.593 CLP — apuntar a ≤$5.000 para tener margen de verdad |
| Canal de validación | Facebook Ads, pago contra entrega (COD) |

El CPA objetivo original de "bajo $7.000" resultó ser, en la práctica, casi
exactamente el techo de equilibrio (breakeven) una vez metida la tarifa
real de envío de Blue Express — no un CPA con margen cómodo. Se evaluaron
6+ productos alternativos del catálogo Dropi (masajeador cuello/hombros,
secador de ropa portátil, irrigador bucal, cremas, etc.) y ninguno superó
al compresor: o el costo Dropi era muy alto respecto al precio de mercado
real, o el ticket era muy bajo para sostener el envío + CPA. Ver
`docs/calculadora-margen.md` para el detalle. Conclusión: el compresor
sigue siendo el mejor candidato, pero solo es viable con CPA controlado
(idealmente ≤$5.000) y tasa de rechazo cerca de 20-25%, no al límite de
$7.000.

Este dato vive parametrizado en [`config/producto-actual.json`](./config/producto-actual.json)
para poder cambiar de producto sin tocar código. Cualquier script o paquete
que necesite datos del producto activo debe leer de ese archivo (o recibir
overrides explícitos por CLI/env), nunca hardcodear cifras de producto.

## Fases del proyecto

- **Fase 0 (actual)** — `/docs`: investigación de integración Dropi↔Shopify,
  checklist legal Chile, y calculadora de margen/viabilidad COD. Se hace
  primero y se espera confirmación del operador antes de avanzar.
- **Fase 1** — Entregables de lanzamiento: `storefront/` (tema/landing
  Shopify de conversión COD + Pixel/CAPI + GA4), `creative-kit/` (generador
  de ángulos, hooks, guiones UGC, copies), `playbook/` (guías paso a paso
  para Facebook Ads siendo principiante).
- **Fase 2 (NO hacer todavía)** — Automatización de métricas
  (Meta/TikTok/Shopify/Dropi con ROAS efectivo real), dashboard, y
  research-radar automatizado de productos ganadores. Ver `TODO.md`.

## Estándares de este repo

- TypeScript estricto (`strict: true`) en todos los paquetes.
- Secretos **solo** por variables de entorno (`.env`, con `.env.example`
  documentado). Nunca hardcodear ni commitear credenciales.
- README por paquete + README raíz.
- El repo debe quedar ejecutable al final de cada fase (no dejar fases a
  medio construir sin documentar el estado).
- Cuando una tarea requiera una credencial del operador (Meta, Shopify,
  Dropi, GA4, etc.), el código debe quedar listo para recibirla vía `.env`,
  y hay que indicar **exactamente**: qué credencial generar, dónde se
  obtiene, y en qué variable pegarla.
- Nada de dashboards, cron jobs de métricas, ni integraciones
  Meta/TikTok/Shopify/Dropi de reporting automatizado hasta Fase 2.

## Meta Ad Library — advertencia importante para research de productos

Para investigación de productos "ganadores" (futuro, no automatizado
todavía): la **API oficial de Meta Ad Library solo cubre anuncios
políticos/electorales y de temas sociales**, no anuncios comerciales
genéricos de dropshipping. La biblioteca de anuncios (interfaz web) sí
permite ver anuncios comerciales activos, pero el contador de
**"impresiones" que a veces se muestra ahí es un requisito de la Ley de
Servicios Digitales (DSA) de la Unión Europea** — es decir, mide
impresiones en la UE, **no refleja rendimiento real en Chile** ni en
Latinoamérica. No usar ese número como proxy de éxito de una campaña.

Las señales válidas para sospechar "posible producto ganador" son:

1. **Días corriendo el mismo anuncio** (≥5-7 días seguidos): un anunciante
   no mantiene un anuncio con pérdidas por una semana.
2. **Número de variaciones activas** del mismo anunciante para el mismo
   producto (varios ángulos/creativos corriendo a la vez): indica que están
   escalando, no solo probando.

Ver detalle y fuentes en `docs/research.md`.

## Qué NO hacer sin permiso explícito

- No avanzar a Fase 1 (`storefront/`, `creative-kit/`, `playbook/`) sin
  confirmación del operador tras revisar `/docs` de Fase 0.
- No construir nada de Fase 2 (dashboard, automatización de métricas).
- No commitear secretos ni credenciales reales.
- No inventar cifras de tarifas de Dropi (envío, comisión) como si fueran
  oficiales: donde no hay dato confirmado, se documenta como **estimado a
  validar** en el panel real de Dropi del operador.
