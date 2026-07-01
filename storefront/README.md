# storefront

Landing de conversión COD para UN producto, pensada para móvil, más el
servidor que la respalda del lado del servidor (Meta Conversions API,
GA4 Measurement Protocol, creación de la orden en Shopify).

```
storefront/
  theme/     Sección + snippets + assets Liquid/CSS/JS para instalar en tu tema de Shopify
  server/    Servidor Node/TS (Dockerizado) que procesa el formulario COD
```

## Por qué un formulario propio en vez del checkout de Shopify

El checkout nativo de Shopify está pensado para pago online. Para COD, un
formulario corto en la misma página (nombre, teléfono, dirección, comuna,
región) convierte mejor que mandar al cliente a un checkout que de todas
formas va a terminar en "pagar cuando llega" — menos pasos, menos fricción,
menos abandono. El precio es que hay que crear la orden nosotros mismos
(eso hace `storefront/server`), en vez de que lo haga el checkout.

## Por qué Conversions API server-side si Shopify ya tiene integración nativa con Meta

Shopify tiene un canal de ventas oficial de Meta que puede mandar eventos
de Conversions API automáticamente. El problema para COD: esa integración
nativa dispara "Purchase" atada al pago/checkout de Shopify, y en nuestro
flujo la orden se crea con `financial_status: pending` (todavía no se ha
cobrado, se cobra en la entrega) — no hay garantía de que la integración
nativa la cuente como conversión en el momento correcto. Por eso
`storefront/server` dispara el evento explícitamente al crear el pedido,
que es el momento que sí controlamos y que es el proxy más cercano a
"intención real de compra" que tenemos en Fase 1 (ver el principio COD en
`CLAUDE.md`: esto sigue siendo un *pedido creado*, no uno *entregado y
cobrado* — el margen real solo se confirma con los pedidos que Dropi marca
como entregados).

## Instalación — resumen de pasos

1. **Servidor** (`storefront/server`): configurar `.env`, levantarlo en tu
   VPS con Docker (junto a n8n). Ver
   [`storefront/server/README.md`](./server/README.md) para las
   instrucciones exactas de cada credencial.
2. **Tema** (`storefront/theme`): copiar los archivos a tu tema de Shopify.
3. Crear una página en Shopify con el template `page.compresor-aire`,
   configurar la sección "Landing COD" desde el editor de temas (elegir el
   producto, pegar la URL del servidor, pegar Pixel ID y GA4 Measurement
   ID, escribir/ajustar los beneficios).
4. Publicar la página y probar el flujo completo con un pedido de prueba
   antes de lanzar la campaña.

## 1. Instalar los archivos del tema

Dos formas, elige la que prefieras:

**Opción A — Shopify CLI (recomendado si ya la usas):**

```bash
shopify theme dev    # o shopify theme push, apuntando a tu tema
```

Copia el contenido de `storefront/theme/` dentro de la carpeta de tu tema
existente (ej. una copia de Dawn), respetando las carpetas
(`sections/`, `snippets/`, `assets/`, `templates/`).

**Opción B — Editor de código del admin de Shopify:**

Admin de Shopify → **Tienda online → Temas → (tu tema) → Editar código** →
sube manualmente cada archivo a la carpeta correspondiente:

- `theme/sections/cod-landing.liquid` → `sections/`
- `theme/snippets/cod-form.liquid` y `cod-tracking-base.liquid` → `snippets/`
- `theme/assets/cod-landing.css` y `cod-landing.js` → `assets/`
- `theme/templates/page.compresor-aire.json` → `templates/`

## 2. Crear la página y configurar la sección

1. Admin → **Tienda online → Páginas → Agregar página**. Título, por
   ejemplo, "Compresor de Aire Portátil".
2. En **Plantilla de tema**, elige `page.compresor-aire`.
3. Guarda, y ve a **Tienda online → Temas → Personalizar**, abre esa
   página. Vas a ver la sección **"Landing COD"** en el editor.
4. En los settings de la sección:
   - **Producto**: selecciona el producto ya creado en Shopify (mismo
     producto que en `config/producto-actual.json`).
   - **URL del servidor de pedidos**: la URL pública donde desplegaste
     `storefront/server` (ej. `https://pedidos.tudominio.cl/pedidos`).
   - **Meta Pixel ID** y **GA4 Measurement ID**: mismos valores que
     configuraste en `storefront/server/.env`.
   - Ajusta título/subtítulo del hero, textos de prueba social/escasez/
     garantía, y los bloques de "Beneficio" (puedes copiar los textos ya
     generados en `creative-kit/output/compresor-aire-portatil.md`).
   - Pega los links a tus páginas de Política de Privacidad y de
     Cambios/Retracto (ver `docs/checklist-legal-chile.md` — hay que
     crearlas en Shopify si no existen: **Configuración → Políticas**).
5. Publica la página y ponla como la página principal de la tienda (o
   apunta tu dominio/campaña directo a su URL) — para una tienda de un
   solo producto no hace falta que el resto del tema (colecciones, etc.)
   esté terminado.

## 3. Probar antes de lanzar

- Llena el formulario tú mismo con datos de prueba y confirma que:
  - Se crea la orden en el admin de Shopify (con `financial_status:
    Pendiente` y el tag `COD`).
  - Llega el email de confirmación del pedido (clave para el derecho a
    retracto de 10 días, ver `docs/checklist-legal-chile.md`).
  - El evento aparece en **Meta Events Manager → Test Events** (usa
    `META_TEST_EVENT_CODE` mientras pruebas) y en **GA4 → DebugView**.
  - La app **Dropify** (ver `docs/research.md`) recoge la orden y la
    sincroniza hacia Dropi.
- Recién después de confirmar esto, saca `META_TEST_EVENT_CODE` del
  `.env` del servidor y reinícialo, para que los eventos reales no queden
  marcados como prueba.

## Cambiar de producto más adelante

1. Actualiza `config/producto-actual.json` (incluyendo `shopify.variantId`).
2. Actualiza `PRODUCTO_NOMBRE`, `PRODUCTO_PRECIO` y `PRODUCTO_VARIANT_ID`
   en `storefront/server/.env` y reinicia el servidor.
3. En el editor de temas, cambia el **Producto** seleccionado en la
   sección "Landing COD" y ajusta los textos (puedes regenerar el punto
   de partida con `npm run generar --workspace=creative-kit`).
