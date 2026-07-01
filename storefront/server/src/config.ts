import "dotenv/config";

export interface Config {
  puerto: number;
  origenPermitido: string;
  shopifyStoreDomain: string;
  shopifyAdminAccessToken: string;
  shopifyApiVersion: string;
  metaPixelId: string;
  metaCapiAccessToken: string;
  metaTestEventCode: string | undefined;
  ga4MeasurementId: string;
  ga4ApiSecret: string;
  productoNombre: string;
  productoPrecio: number;
  productoVarianteId: string;
}

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor || valor.trim() === "") {
    throw new Error(
      `Falta la variable de entorno ${nombre}. Ver storefront/server/.env.example.`
    );
  }
  return valor;
}

export function cargarConfig(): Config {
  return {
    puerto: Number(process.env.PORT ?? 3000),
    origenPermitido: requerida("ALLOWED_ORIGIN"),
    shopifyStoreDomain: requerida("SHOPIFY_STORE_DOMAIN"),
    shopifyAdminAccessToken: requerida("SHOPIFY_ADMIN_ACCESS_TOKEN"),
    shopifyApiVersion: process.env.SHOPIFY_API_VERSION ?? "2025-01",
    metaPixelId: requerida("META_PIXEL_ID"),
    metaCapiAccessToken: requerida("META_CAPI_ACCESS_TOKEN"),
    metaTestEventCode: process.env.META_TEST_EVENT_CODE,
    ga4MeasurementId: requerida("GA4_MEASUREMENT_ID"),
    ga4ApiSecret: requerida("GA4_API_SECRET"),
    // Fuente de verdad del producto: variables de entorno, NUNCA el precio
    // que mande el formulario (no confiar en datos del cliente para el
    // monto real de la orden). Mantener sincronizado con
    // config/producto-actual.json.
    productoNombre: requerida("PRODUCTO_NOMBRE"),
    productoPrecio: Number(requerida("PRODUCTO_PRECIO")),
    productoVarianteId: requerida("PRODUCTO_VARIANT_ID"),
  };
}
