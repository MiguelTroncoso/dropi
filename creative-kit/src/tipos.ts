export interface ProductoMarketing {
  categoria: string;
  problemaQueResuelve: string;
  publicoObjetivo: string;
  beneficios: string[];
  diferenciadores: string[];
  objecionesComunes: string[];
  pruebaSocial: string;
  garantia: string;
  escasezSobria: string;
}

export interface ProductoConfig {
  id: string;
  nombre: string;
  proveedorDropi: string;
  moneda: string;
  costoDropi: number;
  stockDisponible: number;
  precioVentaObjetivo: number;
  cpaObjetivoMaximo: number;
  marketing: ProductoMarketing;
  notas?: string;
}
