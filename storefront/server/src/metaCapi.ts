import type { Config } from "./config.js";
import type { PedidoCOD } from "./tipos.js";
import { sha256, normalizarTelefonoCL, dividirNombre } from "./hash.js";

const META_GRAPH_VERSION = "v21.0";

/**
 * Dispara el evento server-side "Purchase" a Meta Conversions API.
 *
 * Usa el mismo `eventId` que el Pixel del navegador (ver
 * storefront/theme/assets/cod-landing.js) para que Meta deduplique ambos
 * envíos y no cuente la conversión dos veces. Este envío server-side es el
 * que "no se pierde" aunque el navegador tenga bloqueadores de anuncios,
 * Safari ITP, o el usuario cierre la pestaña antes de que el Pixel
 * alcance a disparar — por eso es clave en COD.
 *
 * user_data va hasheado en SHA-256 en minúsculas, como exige Meta.
 */
export async function enviarEventoMetaCapi(
  config: Config,
  pedido: PedidoCOD,
  contexto: { ip: string; userAgent: string }
): Promise<void> {
  const { nombre, apellido } = dividirNombre(pedido.nombre);
  const telefono = normalizarTelefonoCL(pedido.telefono);

  const userData: Record<string, string | string[]> = {
    ph: [sha256(telefono)],
    fn: [sha256(nombre)],
    ln: [sha256(apellido)],
    ct: [sha256(pedido.comuna)],
    st: [sha256(pedido.region)],
    country: [sha256("cl")],
    client_ip_address: contexto.ip,
    client_user_agent: contexto.userAgent,
  };
  if (pedido.fbp) userData.fbp = pedido.fbp;
  if (pedido.fbc) userData.fbc = pedido.fbc;

  const cuerpo = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: pedido.eventId,
        event_source_url: pedido.urlPagina || undefined,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: "CLP",
          value: config.productoPrecio,
          content_ids: [config.productoVarianteId],
          content_type: "product",
          content_name: config.productoNombre,
        },
      },
    ],
    ...(config.metaTestEventCode
      ? { test_event_code: config.metaTestEventCode }
      : {}),
  };

  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${config.metaPixelId}/events?access_token=${config.metaCapiAccessToken}`;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`Meta CAPI respondió ${respuesta.status}: ${detalle}`);
  }
}
