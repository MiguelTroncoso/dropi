import type { Config } from "./config.js";
import type { PedidoCOD } from "./tipos.js";

/**
 * Envío server-side del evento "purchase" a GA4 vía Measurement Protocol,
 * como respaldo del evento que ya dispara gtag.js en el navegador (ver
 * storefront/theme/assets/cod-landing.js). Usa el mismo `ga4ClientId` que
 * capturó el navegador para que ambos eventos queden asociados a la misma
 * sesión en GA4.
 */
export async function enviarEventoGA4(
  config: Config,
  pedido: PedidoCOD
): Promise<void> {
  const clientId = pedido.ga4ClientId || crypto.randomUUID();

  const cuerpo = {
    client_id: clientId,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: pedido.eventId,
          value: config.productoPrecio,
          currency: "CLP",
          items: [
            {
              item_id: config.productoVarianteId,
              item_name: config.productoNombre,
              price: config.productoPrecio,
              quantity: 1,
            },
          ],
        },
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${config.ga4MeasurementId}&api_secret=${config.ga4ApiSecret}`;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });

  // El endpoint de Measurement Protocol responde 204 sin cuerpo incluso
  // ante errores de validación (no hay forma de confirmar 100% desde
  // aquí); solo tratamos como error los códigos HTTP de fallo real.
  if (!respuesta.ok) {
    throw new Error(`GA4 Measurement Protocol respondió ${respuesta.status}`);
  }
}
