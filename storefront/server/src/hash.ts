import { createHash } from "node:crypto";

/** SHA-256 en minúsculas, como exige Meta Conversions API para user_data. */
export function sha256(valor: string): string {
  return createHash("sha256").update(valor.trim().toLowerCase()).digest("hex");
}

/** Normaliza un teléfono chileno a formato E.164 (+56XXXXXXXXX) best-effort. */
export function normalizarTelefonoCL(telefono: string): string {
  const soloDigitos = telefono.replace(/\D/g, "");
  if (soloDigitos.startsWith("56")) return `+${soloDigitos}`;
  return `+56${soloDigitos.replace(/^0+/, "")}`;
}

export function dividirNombre(nombreCompleto: string): {
  nombre: string;
  apellido: string;
} {
  const partes = nombreCompleto.trim().split(/\s+/);
  return {
    nombre: partes[0] ?? nombreCompleto,
    apellido: partes.slice(1).join(" ") || partes[0] || "",
  };
}
