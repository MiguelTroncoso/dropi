import type { Config } from "./config.js";
import type { PedidoCOD } from "./tipos.js";
import { dividirNombre } from "./hash.js";

export interface OrdenCreada {
  id: number;
  name: string;
}

/**
 * Crea la orden en Shopify vía Admin API (financial_status "pending",
 * porque el pago es contra entrega y todavía no se cobra).
 *
 * Usa el producto/precio de la config del servidor (variable de entorno),
 * NUNCA los que mande el formulario — no hay que confiar en datos que
 * vengan del navegador del cliente para el monto real de la orden.
 *
 * Una vez creada, la app Dropify (ver docs/research.md) la sincroniza
 * automáticamente hacia Dropi. `send_receipt: true` hace que Shopify
 * mande el email de confirmación del pedido — eso además cumple el punto
 * del checklist legal de mantener la ventana de retracto en 10 días (ver
 * docs/checklist-legal-chile.md).
 */
export async function crearOrdenShopify(
  config: Config,
  pedido: PedidoCOD
): Promise<OrdenCreada> {
  const { nombre, apellido } = dividirNombre(pedido.nombre);

  const direccion = {
    first_name: nombre,
    last_name: apellido,
    address1: pedido.direccion,
    city: pedido.comuna,
    province: pedido.region,
    country: "Chile",
    phone: pedido.telefono,
  };

  const cuerpo = {
    order: {
      line_items: [
        {
          variant_id: Number(config.productoVarianteId),
          quantity: 1,
        },
      ],
      customer: {
        first_name: nombre,
        last_name: apellido,
        phone: pedido.telefono,
      },
      shipping_address: direccion,
      billing_address: direccion,
      financial_status: "pending",
      gateway: "Pago contra entrega (COD)",
      tags: "COD, landing-cod",
      note: `Pedido COD creado desde landing (${pedido.urlPagina || "sin url"}).`,
      send_receipt: true,
      send_fulfillment_receipt: false,
    },
  };

  const url = `https://${config.shopifyStoreDomain}/admin/api/${config.shopifyApiVersion}/orders.json`;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": config.shopifyAdminAccessToken,
    },
    body: JSON.stringify(cuerpo),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`Shopify respondió ${respuesta.status}: ${detalle}`);
  }

  const json = (await respuesta.json()) as { order: { id: number; name: string } };
  return { id: json.order.id, name: json.order.name };
}
