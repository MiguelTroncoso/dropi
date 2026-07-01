# dropi-cod-server

Servidor mínimo (Node/TS, sin framework) que:

1. Recibe el POST del formulario COD de la landing (`storefront/theme`).
2. Crea la orden en Shopify vía Admin API (`financial_status: pending`,
   porque el pago es contra entrega).
3. Dispara el evento `Purchase` a **Meta Conversions API** y el evento
   `purchase` a **GA4 Measurement Protocol**, ambos server-side — como
   respaldo del Pixel/gtag del navegador, que en COD se puede perder por
   bloqueadores de anuncios, Safari ITP, o que el cliente cierre la
   pestaña antes de que alcance a disparar.

No depende del resto del monorepo (no es un npm workspace) para que el
`Dockerfile` sea simple y autocontenido — se construye y despliega solo.

## 1. Configurar `.env`

```bash
cp .env.example .env
```

Completa cada variable. Dónde obtener cada una:

### Shopify Admin API

1. En tu admin de Shopify: **Configuración → Apps y canales de venta →
   Desarrollar apps → Crear una app**.
2. Ponle un nombre (ej. "COD Server"), ábrela, ve a **Configuración de la
   API de Admin** y dale estos scopes (permisos): `write_orders`,
   `read_orders`, `write_customers`, `read_products`.
3. Pestaña **API credentials** → **Instalar app** → copia el **Admin API
   access token** (empieza con `shpat_...`). **Solo se muestra una vez.**
   → pégalo en `SHOPIFY_ADMIN_ACCESS_TOKEN`.
4. `SHOPIFY_STORE_DOMAIN` es el dominio `.myshopify.com` de tu tienda
   (lo ves en la URL del admin, ej. `tu-tienda.myshopify.com`), no tu
   dominio público.

### Meta Conversions API

1. En [Meta Events Manager](https://business.facebook.com/events_manager2) →
   selecciona tu Pixel → **Configuración**.
2. `META_PIXEL_ID` está arriba de esa misma página (el ID numérico del
   Pixel).
3. Baja a **Conversions API** → **Generar token de acceso** (token
   manual, no hace falta un servidor intermediario de Meta) → copia el
   token → pégalo en `META_CAPI_ACCESS_TOKEN`.
4. Opcional para probar sin ensuciar tus datos reales: en la pestaña
   **Test Events** de Events Manager aparece un **Test Event Code**
   (`TESTxxxxx`) → pégalo en `META_TEST_EVENT_CODE` mientras pruebas, y
   bórralo/coméntalo antes de lanzar la campaña real.

### GA4 Measurement Protocol

1. En Google Analytics → **Administrar** → **Flujos de datos** → elige tu
   flujo web.
2. `GA4_MEASUREMENT_ID` es el que empieza con `G-...`, visible ahí mismo.
3. En la misma pantalla → **Measurement Protocol API secrets** → **Crear**
   → copia el **Secret value** → pégalo en `GA4_API_SECRET`.

### Producto activo

`PRODUCTO_NOMBRE` y `PRODUCTO_PRECIO` deben coincidir con
`config/producto-actual.json` en la raíz del repo. `PRODUCTO_VARIANT_ID`
es el ID de la variante de Shopify del producto:

1. Admin de Shopify → **Productos** → abre el producto → clic en la
   variante (o en el producto si no tiene variantes).
2. En la URL del navegador vas a ver algo como
   `.../products/1234567890/variants/9876543210` — el número después de
   `variants/` es el `PRODUCTO_VARIANT_ID`.

Pega ese mismo ID también en `config/producto-actual.json` →
`shopify.variantId`, para que quede documentado en un solo lugar de
referencia.

## 2. Correr en desarrollo

```bash
npm install
npm run dev
```

Health check: `curl http://localhost:3000/salud`

## 3. Construir y correr con Docker

```bash
docker build -t dropi-cod-server .
docker run --env-file .env -p 3000:3000 dropi-cod-server
```

## 4. Desplegar en tu VPS junto a n8n

Agrega un servicio más al `docker-compose.yml` que ya usas para n8n (no
reemplaces tu archivo, solo agrega este bloque):

```yaml
services:
  dropi-cod-server:
    build: ./ruta/a/storefront/server
    env_file: ./ruta/a/storefront/server/.env
    restart: unless-stopped
    ports:
      - "3000:3000"
    # Si ya usas un reverse proxy (Caddy/Traefik/nginx) para n8n, exponlo
    # con el mismo mecanismo en vez de publicar el puerto directo, y
    # ponle HTTPS — el formulario COD va a mandar datos personales.
```

Después de levantarlo, en el editor de temas de Shopify pega la URL
pública (ej. `https://pedidos.tudominio.cl/pedidos`) en el setting
**"URL del servidor de pedidos"** de la sección "Landing COD".

## Notas de seguridad

- El precio y la variante del producto **nunca** se toman del formulario
  del navegador — siempre de las variables de entorno de este servidor.
  Así nadie puede manipular el monto del pedido editando el HTML/JS del
  navegador.
- `ALLOWED_ORIGIN` restringe qué dominio puede llamar a este servidor
  (CORS). Ponlo exacto, sin comodines.
- Todos los secretos (`SHOPIFY_ADMIN_ACCESS_TOKEN`, `META_CAPI_ACCESS_TOKEN`,
  `GA4_API_SECRET`) van solo en `.env`, nunca en el código ni en git
  (`.env` está en `.gitignore`).
