#!/usr/bin/env node
/**
 * Calculadora de viabilidad de margen para productos COD (Dropi + Shopify Chile).
 *
 * Principio COD: la rentabilidad se mide sobre pedidos ENTREGADOS y
 * cobrados, no sobre pedidos creados. Este script modela eso explícitamente:
 * el costo de producto y el envío de ida se pagan por cada pedido CREADO
 * (Dropi despacha antes de saber si el cliente va a rechazar), el CPA se
 * paga por cada pedido creado, y el ingreso solo llega si el pedido se
 * entrega y se cobra.
 *
 * Uso:
 *   npm run calc-margen -- --precio 29990 --costo 7500 --envio 3990 --rechazo 30 --cpa 6500
 *
 * Cualquier flag que no se pase toma el valor por defecto de
 * config/producto-actual.json (en la raíz del monorepo).
 *
 * Flags disponibles:
 *   --precio <clp>              Precio de venta al público
 *   --costo <clp>                Costo Dropi del producto
 *   --envio <clp>                 Costo de envío de ida por pedido despachado
 *   --envio-devolucion <clp>      Costo de envío de vuelta si el pedido se rechaza
 *                                  (por defecto, igual a --envio)
 *   --rechazo <pct>               % de pedidos que se esperan rechazados/no entregados (0-100)
 *   --cpa <clp>                   Costo por pedido creado en Facebook Ads
 *   --comision <pct>              % de comisión que cobra Dropi sobre el precio de venta
 *   --otros <clp>                 Otros costos fijos por pedido entregado (empaque, etc.)
 *   --config <ruta>               Ruta a un producto-config.json alternativo
 *   --json                        Imprime el resultado como JSON en vez de reporte de texto
 *   --help                        Muestra esta ayuda
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REGLA_MULTIPLO_MINIMO = 2.5;
const REGLA_MULTIPLO_OPTIMO = 3;
const MARGEN_PCT_VIABLE = 15;

interface SupuestosLogisticos {
  costoEnvio: number;
  costoEnvioDevolucion: number;
  tasaRechazoEsperadaPct: number;
  comisionDropiPct: number;
}

interface ProductoConfig {
  id: string;
  nombre: string;
  proveedorDropi: string;
  moneda: string;
  costoDropi: number;
  stockDisponible: number;
  precioVentaObjetivo: number;
  cpaObjetivoMaximo: number;
  supuestosLogisticos: SupuestosLogisticos;
  notas?: string;
}

export interface CalculoInput {
  precioVenta: number;
  costoProducto: number;
  costoEnvio: number;
  costoEnvioDevolucion: number;
  tasaRechazoPct: number;
  cpa: number;
  comisionDropiPct: number;
  otrosCostosFijos: number;
}

export type Veredicto = "VIABLE" | "RIESGOSO" | "NO_VIABLE";

export interface ResultadoCalculo {
  input: CalculoInput;
  probEntrega: number;
  probRechazo: number;
  comisionDropi: number;
  ingresoNetoPorEntrega: number;
  ingresoEsperadoPorPedidoCreado: number;
  costoLogisticoEsperadoPorPedidoCreado: number;
  margenEsperadoAntesDeAds: number;
  margenEsperadoConCPA: number;
  margenPctSobrePrecioVenta: number;
  cpaMaximoViable: number;
  multiploPrecioVentaVsCostoBase: number;
  cumpleReglaMinima2_5x: boolean;
  cumpleReglaOptima3x: boolean;
  veredicto: Veredicto;
}

/**
 * Calcula el margen esperado POR PEDIDO CREADO (no por pedido entregado),
 * ponderando por la probabilidad de entrega. Así el resultado ya refleja
 * el costo real de la tasa de rechazo, no solo el margen "si todo se entrega".
 */
export function calcular(input: CalculoInput): ResultadoCalculo {
  const probRechazo = input.tasaRechazoPct / 100;
  const probEntrega = 1 - probRechazo;

  const comisionDropi = input.precioVenta * (input.comisionDropiPct / 100);
  const ingresoNetoPorEntrega =
    input.precioVenta - comisionDropi - input.otrosCostosFijos;

  const ingresoEsperadoPorPedidoCreado = probEntrega * ingresoNetoPorEntrega;

  // El producto y el envío de ida se pagan en TODOS los pedidos creados,
  // porque Dropi despacha el paquete antes de saber si será rechazado.
  const costoLogisticoEsperadoPorPedidoCreado =
    input.costoProducto +
    input.costoEnvio +
    probRechazo * input.costoEnvioDevolucion;

  const margenEsperadoAntesDeAds =
    ingresoEsperadoPorPedidoCreado - costoLogisticoEsperadoPorPedidoCreado;
  const margenEsperadoConCPA = margenEsperadoAntesDeAds - input.cpa;
  const margenPctSobrePrecioVenta =
    (margenEsperadoConCPA / input.precioVenta) * 100;

  // CPA máximo que se puede pagar por pedido CREADO sin perder plata,
  // dado este precio, costo, envío y tasa de rechazo.
  const cpaMaximoViable = margenEsperadoAntesDeAds;

  const costoBase = input.costoProducto + input.costoEnvio;
  const multiploPrecioVentaVsCostoBase = input.precioVenta / costoBase;

  let veredicto: Veredicto;
  if (margenEsperadoConCPA <= 0) {
    veredicto = "NO_VIABLE";
  } else if (margenPctSobrePrecioVenta < MARGEN_PCT_VIABLE) {
    veredicto = "RIESGOSO";
  } else {
    veredicto = "VIABLE";
  }

  return {
    input,
    probEntrega,
    probRechazo,
    comisionDropi,
    ingresoNetoPorEntrega,
    ingresoEsperadoPorPedidoCreado,
    costoLogisticoEsperadoPorPedidoCreado,
    margenEsperadoAntesDeAds,
    margenEsperadoConCPA,
    margenPctSobrePrecioVenta,
    cpaMaximoViable,
    multiploPrecioVentaVsCostoBase,
    cumpleReglaMinima2_5x: multiploPrecioVentaVsCostoBase >= REGLA_MULTIPLO_MINIMO,
    cumpleReglaOptima3x: multiploPrecioVentaVsCostoBase >= REGLA_MULTIPLO_OPTIMO,
    veredicto,
  };
}

function cargarConfig(rutaConfig: string): ProductoConfig {
  const contenido = readFileSync(rutaConfig, "utf-8");
  return JSON.parse(contenido) as ProductoConfig;
}

function rutaConfigPorDefecto(): string {
  const dirActual = path.dirname(fileURLToPath(import.meta.url));
  // packages/calc-margen/src -> raíz del monorepo
  return path.resolve(dirActual, "../../../config/producto-actual.json");
}

interface Flags {
  precio?: number;
  costo?: number;
  envio?: number;
  "envio-devolucion"?: number;
  rechazo?: number;
  cpa?: number;
  comision?: number;
  otros?: number;
  config?: string;
  json?: boolean;
  help?: boolean;
}

function parseArgs(argv: string[]): Flags {
  const flags: Flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === undefined) continue;
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
      continue;
    }
    if (arg === "--json") {
      flags.json = true;
      continue;
    }
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const valor = argv[i + 1];
    if (valor === undefined || valor.startsWith("--")) {
      throw new Error(`Falta valor para el flag --${key}`);
    }
    i++;
    if (key === "config") {
      flags.config = valor;
    } else {
      const num = Number(valor);
      if (Number.isNaN(num)) {
        throw new Error(`Valor inválido para --${key}: "${valor}"`);
      }
      (flags as Record<string, number>)[key] = num;
    }
  }
  return flags;
}

function formatCLP(valor: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

function formatPct(valor: number): string {
  return `${valor.toFixed(1)}%`;
}

function imprimirAyuda(): void {
  console.log(`
Calculadora de viabilidad de margen COD — Dropi + Shopify Chile

Uso:
  npm run calc-margen -- --precio 29990 --costo 7500 --envio 3990 --rechazo 30 --cpa 6500

Flags (todos opcionales; si faltan, se usa config/producto-actual.json):
  --precio <clp>            Precio de venta al público
  --costo <clp>             Costo Dropi del producto
  --envio <clp>             Costo de envío de ida por pedido despachado
  --envio-devolucion <clp>  Costo de envío de vuelta si se rechaza (default = --envio)
  --rechazo <pct>           % de pedidos rechazados/no entregados esperado (0-100)
  --cpa <clp>               Costo por pedido creado en Facebook Ads
  --comision <pct>          % de comisión de Dropi sobre precio de venta
  --otros <clp>             Otros costos fijos por pedido entregado
  --config <ruta>           Ruta a un producto-config.json alternativo
  --json                    Imprime el resultado como JSON
  --help                    Muestra esta ayuda
`);
}

function construirInput(flags: Flags, config: ProductoConfig): CalculoInput {
  const s = config.supuestosLogisticos;
  const envio = flags.envio ?? s.costoEnvio;
  return {
    precioVenta: flags.precio ?? config.precioVentaObjetivo,
    costoProducto: flags.costo ?? config.costoDropi,
    costoEnvio: envio,
    costoEnvioDevolucion: flags["envio-devolucion"] ?? s.costoEnvioDevolucion ?? envio,
    tasaRechazoPct: flags.rechazo ?? s.tasaRechazoEsperadaPct,
    cpa: flags.cpa ?? config.cpaObjetivoMaximo,
    comisionDropiPct: flags.comision ?? s.comisionDropiPct,
    otrosCostosFijos: flags.otros ?? 0,
  };
}

function imprimirReporte(config: ProductoConfig, resultado: ResultadoCalculo): void {
  const r = resultado;
  const i = resultado.input;

  const veredictoTexto: Record<Veredicto, string> = {
    VIABLE: "✅ VIABLE — margen saludable al CPA indicado.",
    RIESGOSO:
      "⚠️  RIESGOSO — hay margen positivo pero muy ajustado. Cualquier alza en rechazo, envío o CPA lo puede volver pérdida.",
    NO_VIABLE:
      "❌ NO VIABLE — a este CPA, precio, costo y tasa de rechazo, se pierde plata en promedio por pedido creado.",
  };

  console.log(`\n=== Calculadora de margen COD — ${config.nombre} ===\n`);
  console.log("Supuestos usados en este cálculo:");
  console.log(`  Precio de venta:            ${formatCLP(i.precioVenta)}`);
  console.log(`  Costo Dropi (producto):     ${formatCLP(i.costoProducto)}`);
  console.log(`  Envío de ida:               ${formatCLP(i.costoEnvio)}`);
  console.log(`  Envío de devolución:        ${formatCLP(i.costoEnvioDevolucion)}`);
  console.log(`  Tasa de rechazo esperada:   ${formatPct(i.tasaRechazoPct)}`);
  console.log(`  Comisión Dropi:             ${formatPct(i.comisionDropiPct)}`);
  console.log(`  Otros costos fijos:         ${formatCLP(i.otrosCostosFijos)}`);
  console.log(`  CPA (por pedido creado):    ${formatCLP(i.cpa)}`);

  console.log("\nRegla simple (precio ≥ 2.5-3x costo base = producto + envío):");
  console.log(
    `  Múltiplo actual: ${r.multiploPrecioVentaVsCostoBase.toFixed(2)}x` +
      ` (mínimo ${REGLA_MULTIPLO_MINIMO}x, óptimo ${REGLA_MULTIPLO_OPTIMO}x)`
  );
  console.log(
    `  ${r.cumpleReglaMinima2_5x ? "✅" : "❌"} Cumple mínimo ${REGLA_MULTIPLO_MINIMO}x`
  );
  console.log(
    `  ${r.cumpleReglaOptima3x ? "✅" : "❌"} Cumple óptimo ${REGLA_MULTIPLO_OPTIMO}x`
  );

  console.log("\nAnálisis COD real (ponderado por probabilidad de entrega):");
  console.log(
    `  Prob. de entrega / rechazo:     ${formatPct(r.probEntrega * 100)} / ${formatPct(r.probRechazo * 100)}`
  );
  console.log(
    `  Ingreso esperado por pedido creado:  ${formatCLP(r.ingresoEsperadoPorPedidoCreado)}`
  );
  console.log(
    `  Costo logístico esperado por pedido: ${formatCLP(r.costoLogisticoEsperadoPorPedidoCreado)}`
  );
  console.log(
    `  Margen esperado ANTES de ads:        ${formatCLP(r.margenEsperadoAntesDeAds)}`
  );
  console.log(
    `  Margen esperado DESPUÉS del CPA:     ${formatCLP(r.margenEsperadoConCPA)} (${formatPct(r.margenPctSobrePrecioVenta)} del precio de venta)`
  );
  console.log(
    `  CPA máximo viable (breakeven):       ${formatCLP(r.cpaMaximoViable)}`
  );

  console.log(`\nVeredicto: ${veredictoTexto[r.veredicto]}\n`);
}

function main(): void {
  const flags = parseArgs(process.argv.slice(2));
  if (flags.help) {
    imprimirAyuda();
    return;
  }

  const rutaConfig = flags.config
    ? path.resolve(process.cwd(), flags.config)
    : rutaConfigPorDefecto();
  const config = cargarConfig(rutaConfig);
  const input = construirInput(flags, config);
  const resultado = calcular(input);

  if (flags.json) {
    console.log(JSON.stringify(resultado, null, 2));
  } else {
    imprimirReporte(config, resultado);
  }
}

const esEjecucionDirecta =
  process.argv[1] === fileURLToPath(import.meta.url);
if (esEjecucionDirecta) {
  main();
}
