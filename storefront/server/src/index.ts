import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { cargarConfig } from "./config.js";
import { validarPedido } from "./validacion.js";
import { crearOrdenShopify } from "./shopify.js";
import { enviarEventoMetaCapi } from "./metaCapi.js";
import { enviarEventoGA4 } from "./ga4.js";

const TAMANO_MAXIMO_BODY = 1024 * 1024; // 1MB, suficiente para este formulario

const config = cargarConfig();

function leerCuerpo(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let datos = "";
    let tamano = 0;
    req.on("data", (chunk: Buffer) => {
      tamano += chunk.length;
      if (tamano > TAMANO_MAXIMO_BODY) {
        reject(new Error("Cuerpo de la solicitud demasiado grande."));
        req.destroy();
        return;
      }
      datos += chunk;
    });
    req.on("end", () => {
      if (!datos) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(datos));
      } catch {
        reject(new Error("JSON inválido."));
      }
    });
    req.on("error", reject);
  });
}

function obtenerIpCliente(req: IncomingMessage): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]?.trim() ?? "";
  }
  return req.socket.remoteAddress ?? "";
}

function aplicarCabecerasCORS(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", config.origenPermitido);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function enviarJSON(res: ServerResponse, status: number, cuerpo: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(cuerpo));
}

async function manejarPedido(req: IncomingMessage, res: ServerResponse): Promise<void> {
  let cuerpoCrudo: unknown;
  try {
    cuerpoCrudo = await leerCuerpo(req);
  } catch (error) {
    enviarJSON(res, 400, { error: (error as Error).message });
    return;
  }

  const resultado = validarPedido(cuerpoCrudo);
  if (!resultado.ok) {
    enviarJSON(res, 400, { error: resultado.error });
    return;
  }

  const pedido = resultado.datos;

  let orden;
  try {
    orden = await crearOrdenShopify(config, pedido);
  } catch (error) {
    console.error("Error creando orden en Shopify:", error);
    enviarJSON(res, 502, {
      error: "No se pudo crear el pedido en Shopify. Intenta de nuevo en unos minutos.",
    });
    return;
  }

  // La orden ya se creó — eso es lo crítico. Si falla el tracking, se
  // registra el error pero igual respondemos éxito al cliente.
  const contexto = { ip: obtenerIpCliente(req), userAgent: req.headers["user-agent"] ?? "" };
  const resultadosTracking = await Promise.allSettled([
    enviarEventoMetaCapi(config, pedido, contexto),
    enviarEventoGA4(config, pedido),
  ]);
  resultadosTracking.forEach((r, i) => {
    if (r.status === "rejected") {
      const nombre = i === 0 ? "Meta CAPI" : "GA4 Measurement Protocol";
      console.error(`Error enviando evento a ${nombre}:`, r.reason);
    }
  });

  enviarJSON(res, 200, { ok: true, orderId: orden.id, orderName: orden.name });
}

const servidor = createServer((req, res) => {
  aplicarCabecerasCORS(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/salud") {
    enviarJSON(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "POST" && req.url === "/pedidos") {
    manejarPedido(req, res).catch((error) => {
      console.error("Error inesperado manejando pedido:", error);
      enviarJSON(res, 500, { error: "Error interno." });
    });
    return;
  }

  enviarJSON(res, 404, { error: "No encontrado." });
});

servidor.listen(config.puerto, () => {
  console.log(`Servidor de pedidos COD escuchando en el puerto ${config.puerto}`);
});
