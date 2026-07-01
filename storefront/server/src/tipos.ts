export interface PedidoCOD {
  nombre: string;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  eventId: string;
  fbp: string;
  fbc: string;
  ga4ClientId: string;
  urlPagina: string;
}

export type ResultadoValidacion =
  | { ok: true; datos: PedidoCOD }
  | { ok: false; error: string };
