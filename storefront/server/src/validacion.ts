import type { PedidoCOD, ResultadoValidacion } from "./tipos.js";

function textoValido(valor: unknown, minimo: number): valor is string {
  return typeof valor === "string" && valor.trim().length >= minimo;
}

export function validarPedido(cuerpo: unknown): ResultadoValidacion {
  if (typeof cuerpo !== "object" || cuerpo === null) {
    return { ok: false, error: "Cuerpo de la solicitud inválido." };
  }

  const b = cuerpo as Record<string, unknown>;

  if (!textoValido(b.nombre, 3)) {
    return { ok: false, error: "El nombre es obligatorio (mínimo 3 caracteres)." };
  }
  if (!textoValido(b.telefono, 8)) {
    return { ok: false, error: "El teléfono es obligatorio." };
  }
  if (!textoValido(b.direccion, 5)) {
    return { ok: false, error: "La dirección es obligatoria." };
  }
  if (!textoValido(b.comuna, 2)) {
    return { ok: false, error: "La comuna es obligatoria." };
  }
  if (!textoValido(b.region, 2)) {
    return { ok: false, error: "La región es obligatoria." };
  }

  const datos: PedidoCOD = {
    nombre: (b.nombre as string).trim(),
    telefono: (b.telefono as string).trim(),
    direccion: (b.direccion as string).trim(),
    comuna: (b.comuna as string).trim(),
    region: (b.region as string).trim(),
    eventId:
      typeof b.eventId === "string" && b.eventId.trim() !== ""
        ? b.eventId.trim()
        : crypto.randomUUID(),
    fbp: typeof b.fbp === "string" ? b.fbp.trim() : "",
    fbc: typeof b.fbc === "string" ? b.fbc.trim() : "",
    ga4ClientId: typeof b.ga4ClientId === "string" ? b.ga4ClientId.trim() : "",
    urlPagina: typeof b.urlPagina === "string" ? b.urlPagina.trim() : "",
  };

  return { ok: true, datos };
}
