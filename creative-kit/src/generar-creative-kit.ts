#!/usr/bin/env node
/**
 * Generador de creative kit (ángulos, hooks, guiones UGC, copies FB,
 * specs de imágenes y brief UGC) en español de Chile, a partir del
 * producto activo en config/producto-actual.json.
 *
 * Uso:
 *   npm run generar                       # usa config/producto-actual.json
 *   npm run generar -- --config ruta.json # usa otro producto
 *   npm run generar -- --stdout           # además de guardar, imprime en consola
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { ProductoConfig } from "./tipos.js";

function formatCLP(valor: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

function beneficio(p: ProductoConfig, i: number): string {
  return p.marketing.beneficios[i] ?? p.marketing.beneficios[0] ?? p.nombre;
}

function diferenciador(p: ProductoConfig, i: number): string {
  return p.marketing.diferenciadores[i] ?? p.marketing.diferenciadores[0] ?? "";
}

function primerasPalabras(texto: string, n: number): string {
  const palabras = texto.split(/\s+/);
  if (palabras.length <= n) return texto;
  return palabras.slice(0, n).join(" ") + "...";
}

// ---------------------------------------------------------------------------
// 5 ángulos de venta
// ---------------------------------------------------------------------------

interface Angulo {
  numero: number;
  nombre: string;
  ideaCentral: string;
  ejemploTitular: string;
}

function generarAngulos(p: ProductoConfig): Angulo[] {
  const m = p.marketing;
  return [
    {
      numero: 1,
      nombre: "El problema en el peor momento",
      ideaCentral: `Parte del dolor real: ${m.problemaQueResuelve}`,
      ejemploTitular: `¿Te ha pasado? Con el ${p.nombre} no vuelve a pasar.`,
    },
    {
      numero: 2,
      nombre: "Para toda la familia",
      ideaCentral: `Muestra el producto en el uso cotidiano de ${m.publicoObjetivo}`,
      ejemploTitular: `Ideal para la casa, el auto y los niños — ${beneficio(p, 0)}.`,
    },
    {
      numero: 3,
      nombre: "Se paga solo (ahorro y conveniencia)",
      ideaCentral:
        "Compara el costo/tiempo de la alternativa (ir a una bencinera, esperar ayuda, pagar a un taller) contra tener el producto a mano en casa.",
      ejemploTitular: `Ahórrate la vuelta a la bencinera: ${beneficio(p, 0).toLowerCase()}.`,
    },
    {
      numero: 4,
      nombre: "Tecnología simple, sin complicaciones",
      ideaCentral: `Destaca el diferenciador técnico sin tecnicismos: ${diferenciador(p, 0)}`,
      ejemploTitular: `Eliges lo que necesitas, aprietas un botón, y listo.`,
    },
    {
      numero: 5,
      nombre: "Uno solo, sirve para todo",
      ideaCentral: `Versatilidad: ${m.beneficios.join("; ")}`,
      ejemploTitular: `Un solo ${p.nombre.toLowerCase()} para toda la casa.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// 10 hooks de video (primeros 3 segundos)
// ---------------------------------------------------------------------------

function generarHooks(p: ProductoConfig): string[] {
  const m = p.marketing;
  return [
    `¿Te ha pasado esto? ${primerasPalabras(m.problemaQueResuelve, 10)}`,
    `Esto se compra una vez y se usa para siempre.`,
    `Para. No sigas viendo esto sin saber qué es.`,
    `Mira lo rápido que hace esto (cronómetro en pantalla).`,
    `No, no necesita estar enchufado a la pared.`,
    `Esto debería venir de fábrica en cada auto.`,
    `${m.pruebaSocial}.`,
    `3 cosas que no sabías que podías hacer con esto.`,
    `Se detiene solo. Así de fácil.`,
    `Si tienes auto o hijos chicos, esto te sirve.`,
  ];
}

// ---------------------------------------------------------------------------
// 3 guiones UGC, escena por escena (grabables con celular)
// ---------------------------------------------------------------------------

interface Escena {
  tiempo: string;
  accionYCamara: string;
  textoHablado: string;
}

interface GuionUGC {
  titulo: string;
  duracionTotal: string;
  escenas: Escena[];
}

function generarGuionesUGC(p: ProductoConfig): GuionUGC[] {
  const precio = formatCLP(p.precioVentaObjetivo);
  return [
    {
      titulo: "Guion 1 — Problema → Solución",
      duracionTotal: "~25 segundos",
      escenas: [
        {
          tiempo: "0-3s",
          accionYCamara:
            "Plano medio, cara de frustración junto al auto o con el problema a la vista.",
          textoHablado: `"Otra vez con este problema y ya se me hizo tarde."`,
        },
        {
          tiempo: "3-8s",
          accionYCamara: `Saca el ${p.nombre.toLowerCase()} y lo conecta.`,
          textoHablado: `"Por suerte ando con esto."`,
        },
        {
          tiempo: "8-15s",
          accionYCamara: "Primer plano a la pantalla/indicador mientras funciona.",
          textoHablado: `"Le pongo lo que necesito, y se detiene solo cuando llega."`,
        },
        {
          tiempo: "15-20s",
          accionYCamara: "Se ve el resultado resuelto, persona sonriendo y siguiendo su día.",
          textoHablado: `"Listo. Ni vueltas ni esperas."`,
        },
        {
          tiempo: "20-25s (CTA)",
          accionYCamara: "Producto en mano, mirando a cámara.",
          textoHablado: `"Lo pedí por Facebook a ${precio}, llega a la puerta de tu casa y pagas cuando te lo entregan."`,
        },
      ],
    },
    {
      titulo: "Guion 2 — Unboxing + demo rápida",
      duracionTotal: "~30 segundos",
      escenas: [
        {
          tiempo: "0-5s",
          accionYCamara: "Abrir la caja en cámara, mostrar todo el contenido sobre la mesa.",
          textoHablado: `"Les muestro qué trae el ${p.nombre.toLowerCase()}."`,
        },
        {
          tiempo: "5-12s",
          accionYCamara: "Mostrar la pantalla/controles de cerca, señalar los botones.",
          textoHablado: `"${diferenciador(p, 0)}."`,
        },
        {
          tiempo: "12-22s",
          accionYCamara:
            "Demo real usándolo (inflar algo visualmente claro: pelota, colchón inflable, neumático de bici).",
          textoHablado: `"Miren qué rápido."`,
        },
        {
          tiempo: "22-26s",
          accionYCamara: "Mostrar que se detiene solo, cara de sorpresa/aprobación.",
          textoHablado: `"Y se apaga solo, no hay que estar mirando."`,
        },
        {
          tiempo: "26-30s (CTA)",
          accionYCamara: "Producto en mano, mirando a cámara.",
          textoHablado: `"Está a ${precio}, con pago contra entrega."`,
        },
      ],
    },
    {
      titulo: "Guion 3 — Uso cotidiano / testimonio familiar",
      duracionTotal: "~25 segundos",
      escenas: [
        {
          tiempo: "0-6s",
          accionYCamara: `Escena de uso cotidiano ligada a ${p.marketing.publicoObjetivo.split(",")[0]?.toLowerCase() ?? "la familia"}.`,
          textoHablado: `(sin texto, solo la acción — dejar que se vea natural)`,
        },
        {
          tiempo: "6-12s",
          accionYCamara: "Corte a mostrar el producto de cerca en uso.",
          textoHablado: `"Lo compré para esto, pero después le encontré más usos."`,
        },
        {
          tiempo: "12-18s",
          accionYCamara: "Mostrar un segundo uso distinto (ej. auto, bici).",
          textoHablado: `"También lo uso para el auto — le sirve a toda la familia."`,
        },
        {
          tiempo: "18-22s",
          accionYCamara: "Testimonio a cámara, tono conversacional (no leído).",
          textoHablado: `"${p.marketing.pruebaSocial}."`,
        },
        {
          tiempo: "22-25s (CTA)",
          accionYCamara: "Producto en mano.",
          textoHablado: `"Pide el tuyo, pagas cuando te llega a la casa."`,
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// 3 copies de Facebook (texto primario + titular + descripción)
// ---------------------------------------------------------------------------

interface CopyFacebook {
  angulo: string;
  textoPrimario: string;
  titular: string;
  descripcion: string;
}

function generarCopiesFacebook(p: ProductoConfig): CopyFacebook[] {
  const m = p.marketing;
  const precio = formatCLP(p.precioVentaObjetivo);
  return [
    {
      angulo: "Problema / urgencia",
      textoPrimario:
        `${m.problemaQueResuelve}\n\n` +
        `Con el ${p.nombre} lo resuelves en minutos, sin salir de tu casa.\n\n` +
        `✅ ${beneficio(p, 0)}\n` +
        `✅ ${beneficio(p, 1)}\n` +
        `✅ ${m.garantia}\n\n` +
        `📦 ${m.escasezSobria}. Pagas cuando te llega a la puerta de tu casa.`,
      titular: `${p.nombre} — ${precio}`,
      descripcion: "Pago contra entrega en todo Chile",
    },
    {
      angulo: "Familia / versatilidad",
      textoPrimario:
        `Un solo producto para toda la casa: ${m.beneficios.join(", ").toLowerCase()}.\n\n` +
        `Perfecto para ${m.publicoObjetivo.toLowerCase()}\n\n` +
        `✅ ${diferenciador(p, 1) || diferenciador(p, 0)}\n` +
        `✅ ${m.garantia}\n\n` +
        `${m.pruebaSocial}.`,
      titular: `Sirve para todo — ${precio}`,
      descripcion: "Compra fácil, pago cuando lo recibes",
    },
    {
      angulo: "Tecnología simple",
      textoPrimario:
        `${diferenciador(p, 0)}.\n\n` +
        `Nada de estar adivinando ni mirando todo el rato: eliges lo que necesitas y listo.\n\n` +
        `✅ ${beneficio(p, 2) || beneficio(p, 0)}\n` +
        `✅ ${beneficio(p, 3) || beneficio(p, 1)}\n\n` +
        `${m.escasezSobria}. Pide el tuyo hoy — pagas contra entrega.`,
      titular: `Fácil de usar — ${precio}`,
      descripcion: "Pantalla digital, se detiene solo",
    },
  ];
}

// ---------------------------------------------------------------------------
// Specs de imágenes para Canva
// ---------------------------------------------------------------------------

function generarSpecsImagenes(p: ProductoConfig): string {
  return `
### Formato 1:1 (feed) — 1080 x 1080 px

- Producto real (no foto genérica de stock) ocupando al menos 60% del cuadro.
- Zona segura de texto: dejar ~10% de margen en los 4 bordes libres de texto
  importante (se puede recortar en algunos placements).
- Texto grande y legible en pantalla de celular (mínimo ~60px para el titular).
- Incluir siempre: precio y la frase "Pago contra entrega".
- Contraste alto entre texto y fondo — nada de texto claro sobre fondo claro.
- Logo/marca pequeño en una esquina, sin tapar el producto.

### Formato 4:5 (feed vertical / Reels / Stories) — 1080 x 1350 px

- Mismas reglas que 1:1, con más espacio vertical para agregar 2-3 bullets de
  beneficios (usar los beneficios de \`config/producto-actual.json\` →
  \`marketing.beneficios\`).
- Si es para Stories/Reels como imagen estática, dejar los primeros y últimos
  ~250px verticales libres de texto importante (se tapan con la UI de
  Instagram/Facebook: nombre de usuario arriba, "Enviar mensaje"/reacciones
  abajo).

### Checklist rápido antes de subir a Canva

- [ ] ¿Se lee el titular a tamaño miniatura (celular, feed)?
- [ ] ¿Aparece el precio (${formatCLP(p.precioVentaObjetivo)})?
- [ ] ¿Aparece "Pago contra entrega" o "Contra entrega"?
- [ ] ¿El producto se ve real y reconocible (no genérico)?
`.trim();
}

// ---------------------------------------------------------------------------
// Ficha de producto para Shopify (título + descripción HTML lista para pegar)
// ---------------------------------------------------------------------------

function generarFichaProductoShopify(p: ProductoConfig): string {
  const m = p.marketing;
  const beneficiosHtml = m.beneficios
    .map((b) => `<li>${b}</li>`)
    .join("\n");

  const descripcionHtml = `<p>${m.problemaQueResuelve}</p>
<p><strong>Con el ${p.nombre} lo resuelves en minutos, sin salir de tu casa.</strong></p>

<h3>¿Por qué te va a servir?</h3>
<ul>
${beneficiosHtml}
</ul>

<h3>Fácil de usar</h3>
<p>${diferenciador(p, 0)}.${diferenciador(p, 1) ? ` ${diferenciador(p, 1)}.` : ""}</p>

<h3>Compra con confianza</h3>
<p>✅ ${m.pruebaSocial}<br>
✅ ${m.garantia}<br>
💵 <strong>Pago contra entrega:</strong> revisas tu pedido y pagas cuando te llega a la puerta de tu casa</p>`;

  return `
**Título del producto:**

\`\`\`
${p.nombre}
\`\`\`

**Descripción (HTML — pégalo con el botón "<>" del editor de Shopify, o pega el texto y aplica el formato a mano):**

\`\`\`html
${descripcionHtml}
\`\`\`

**Otros campos del formulario "Agregar producto" en Shopify:**

| Campo | Valor sugerido |
|---|---|
| Precio | ${formatCLP(p.precioVentaObjetivo)} |
| Costo por artículo | ${formatCLP(p.costoDropi)} (uso interno, no lo ve el cliente) |
| Cantidad disponible | ${p.stockDisponible} (o el stock real actual en tu panel Dropi) |
| Tipo de producto | ${m.categoria} |
| Categoría del producto (Shopify) | Elige la más cercana en el buscador de categorías de Shopify |
| SKU (opcional) | \`${p.id.toUpperCase().replace(/-/g, "_")}\` |

**Importante — no rellenar "Precio de comparación" (precio tachado) con un número inventado.** Ese campo se usa para mostrar un descuento real; poner un "antes" falso es información engañosa y puede chocar con la Ley del Consumidor (ver \`docs/checklist-legal-chile.md\`). Solo úsalo si de verdad vas a vender con un descuento genuino sobre un precio anterior real.

**Fotos:** usa fotos reales del producto (las que trae la ficha de Dropi u otras que tengas), no imágenes genéricas de stock — en el texto alternativo (alt text) de cada imagen describe el producto en una frase corta, ayuda al SEO y a la accesibilidad.
`.trim();
}

// ---------------------------------------------------------------------------
// Brief para pedir UGC
// ---------------------------------------------------------------------------

function generarBriefUGC(p: ProductoConfig, hooks: string[]): string {
  const m = p.marketing;
  return `
**Producto:** ${p.nombre}
**Precio de venta:** ${formatCLP(p.precioVentaObjetivo)} (pago contra entrega)
**Categoría:** ${m.categoria}

**Qué mostrar (en este orden):**
1. El problema/situación antes de tener el producto: ${m.problemaQueResuelve}
2. El producto en uso real (no una demo de estudio) — ver Guion 2 de este kit.
3. El resultado/beneficio principal ya resuelto.
4. Mención natural del precio y "pago contra entrega" al cierre.

**Tono:** conversacional, como si le estuvieras contando a un amigo/a. Nada
de tono "comercial de TV" ni leer un libreto de memoria — mejor que suene
espontáneo aunque se grabe varias tomas.

**Duración:** 20-35 segundos por video. 2-3 tomas por escena para tener de
dónde elegir en edición.

**Hooks sugeridos para los primeros 3 segundos** (elegir 1, no leerlos
literal, adaptarlos a como hablarías tú):
${hooks.map((h) => `- ${h}`).join("\n")}

**Qué NO hacer:**
- No prometer resultados que el producto no da.
- No comparar por nombre con otras marcas/competencia.
- No grabar en formato horizontal (todo vertical, 9:16).
- No usar música con copyright si el video se sube directo a Meta Ads
  (mejor sin música o con audio libre de derechos).

**Entregables esperados:** 3-5 videos verticales (9:16), sin editar (raw),
más 5-8 fotos sueltas del producto en uso para las imágenes estáticas.

**Referencia:** usar los guiones de este mismo documento (sección "Guiones
UGC") como punto de partida, no hace falta seguirlos palabra por palabra.
`.trim();
}

// ---------------------------------------------------------------------------
// Ensamblado del documento final
// ---------------------------------------------------------------------------

function generarMarkdown(p: ProductoConfig): string {
  const angulos = generarAngulos(p);
  const hooks = generarHooks(p);
  const guiones = generarGuionesUGC(p);
  const copies = generarCopiesFacebook(p);

  const seccionAngulos = angulos
    .map(
      (a) =>
        `### ${a.numero}. ${a.nombre}\n\n- **Idea central:** ${a.ideaCentral}\n- **Ejemplo de titular:** "${a.ejemploTitular}"`
    )
    .join("\n\n");

  const seccionHooks = hooks.map((h, i) => `${i + 1}. "${h}"`).join("\n");

  const seccionGuiones = guiones
    .map((g) => {
      const filas = g.escenas
        .map(
          (e) =>
            `| ${e.tiempo} | ${e.accionYCamara} | ${e.textoHablado} |`
        )
        .join("\n");
      return `### ${g.titulo} (${g.duracionTotal})\n\n| Tiempo | Acción / Cámara | Qué decir |\n|---|---|---|\n${filas}`;
    })
    .join("\n\n");

  const seccionCopies = copies
    .map(
      (c, i) =>
        `### Copy ${i + 1} — ${c.angulo}\n\n**Texto primario:**\n\n> ${c.textoPrimario.replace(/\n/g, "\n> ")}\n\n**Titular:** ${c.titular}\n\n**Descripción:** ${c.descripcion}`
    )
    .join("\n\n");

  return `# Creative Kit — ${p.nombre}

Generado a partir de \`config/producto-actual.json\`. Si cambias de
producto, actualiza ese archivo y vuelve a correr
\`npm run generar\` en \`creative-kit/\` — no hace falta tocar este texto a
mano (aunque después de generarlo, ajústalo con tu criterio y lo que veas
que funciona).

## Ficha de producto para Shopify

${generarFichaProductoShopify(p)}

## 5 ángulos de venta

${seccionAngulos}

## 10 hooks de video (primeros 3 segundos)

${seccionHooks}

## Guiones UGC — escena por escena (grabables con celular)

${seccionGuiones}

## Copies de Facebook

${seccionCopies}

## Specs de imágenes para Canva

${generarSpecsImagenes(p)}

## Brief para pedir UGC (a un creador o para grabar tú mismo)

${generarBriefUGC(p, hooks)}
`;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface Flags {
  config?: string;
  out?: string;
  stdout?: boolean;
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
    if (arg === "--stdout") {
      flags.stdout = true;
      continue;
    }
    if (arg === "--config" || arg === "--out") {
      const valor = argv[i + 1];
      if (valor === undefined) throw new Error(`Falta valor para ${arg}`);
      if (arg === "--config") flags.config = valor;
      else flags.out = valor;
      i++;
    }
  }
  return flags;
}

function imprimirAyuda(): void {
  console.log(`
Generador de creative kit — Dropi + Shopify Chile

Uso:
  npm run generar                        # usa config/producto-actual.json
  npm run generar -- --config ruta.json  # usa otro producto
  npm run generar -- --out ruta.md       # cambia dónde se guarda
  npm run generar -- --stdout            # también imprime en consola
`);
}

function rutaConfigPorDefecto(): string {
  const dirActual = path.dirname(fileURLToPath(import.meta.url));
  // creative-kit/src -> raíz del monorepo
  return path.resolve(dirActual, "../../config/producto-actual.json");
}

function main(): void {
  const flags = parseArgs(process.argv.slice(2));
  if (flags.help) {
    imprimirAyuda();
    return;
  }

  const dirActual = path.dirname(fileURLToPath(import.meta.url));
  const rutaConfig = flags.config
    ? path.resolve(process.cwd(), flags.config)
    : rutaConfigPorDefecto();
  const config = JSON.parse(readFileSync(rutaConfig, "utf-8")) as ProductoConfig;

  const markdown = generarMarkdown(config);

  const rutaSalida = flags.out
    ? path.resolve(process.cwd(), flags.out)
    : path.resolve(dirActual, "../output", `${config.id}.md`);

  mkdirSync(path.dirname(rutaSalida), { recursive: true });
  writeFileSync(rutaSalida, markdown, "utf-8");
  console.log(`Creative kit generado en: ${rutaSalida}`);

  if (flags.stdout) {
    console.log("\n" + markdown);
  }
}

const esEjecucionDirecta = process.argv[1] === fileURLToPath(import.meta.url);
if (esEjecucionDirecta) {
  main();
}
