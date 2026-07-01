# 03 — Lectura de métricas

El embudo real de este proyecto, de arriba a abajo, y qué evento de
tracking corresponde a cada paso:

```
Impresión (se mostró el anuncio)
    ↓  CTR
Clic al anuncio → llega a la landing        (PageView)
    ↓
Toca el botón "Pedir ahora"                 (InitiateCheckout)
    ↓
Llena el formulario y lo envía              (Purchase — pedido COD CREADO)
    ↓  esto NO lo mide Meta/GA4, hay que mirarlo en Dropi
Dropi entrega y cobra el pedido             (pedido ENTREGADO — la plata real)
```

**El punto más importante de esta guía:** Meta y GA4 solo ven hasta
"pedido creado". Lo que pasa después (¿se entregó? ¿se rechazó?) vive en
Dropi, no en Meta Ads Manager. Cualquier "ROAS" que te muestre Meta está
midiendo contra pedidos CREADOS, no ENTREGADOS — por eso este proyecto le
llama a eso **"ROAS reportado"**, para distinguirlo del **"ROAS efectivo"**
real (ver más abajo).

## Métricas de arriba del embudo

| Métrica | Qué mide | Referencia para COD Chile (orientativa, no absoluta) |
|---|---|---|
| **CPM** (costo por mil impresiones) | Cuánto cuesta que Meta le muestre tu anuncio a 1.000 personas | Varía mucho por temporada/competencia — mira la tendencia en tu cuenta, no un número mágico |
| **CTR** (click-through rate, todos los clics o "link clicks") | % de gente que vio el anuncio y le hizo clic | Por debajo de ~1% en link clicks suele ser señal de que el creativo/hook no engancha |
| **CPC** (costo por clic) | Cuánto pagas por cada clic al link | Combinación de CPM y CTR — si es alto, revisa primero el CTR antes que el CPM |

Si el CTR es bueno pero el CPA es malo, el problema probablemente **no**
es el creativo — es la landing, el precio, o la oferta. Si el CTR es malo,
el problema es el creativo/hook (empieza por ahí, ver Guía 05).

## Métricas de conversión

| Métrica | Qué mide | Cómo se ve en este proyecto |
|---|---|---|
| **Inicio de compra** (InitiateCheckout) | Tocaron el CTA, mostraron intención | Útil para ver si el problema está antes o después del formulario |
| **CPA** (costo por pedido CREADO) | Gasto total ÷ pedidos COD creados (evento `Purchase`) | Compáralo contra el CPA objetivo del producto activo (`config/producto-actual.json` → `cpaObjetivoMaximo`) |
| **"ROAS" que muestra Meta** | (precio de venta × pedidos creados) ÷ gasto | Es el ROAS **reportado**, no el real — ver siguiente sección |

## CPA real vs. CPA "que alcanza a pagar el margen"

No compares el CPA solo contra el "CPA objetivo" a secas — compáralo
contra lo que la calculadora de márgenes dice que es viable **con tu tasa
de rechazo real**:

```bash
npm run calc-margen -- --cpa <tu_cpa_actual> --rechazo <tu_tasa_de_rechazo_real>
```

Ver [`docs/calculadora-margen.md`](../docs/calculadora-margen.md) para el
detalle completo de esta cuenta. El ejemplo ya corrido ahí muestra que con
30% de rechazo y el envío real, un CPA de $7.000 ya pierde plata — el CPA
objetivo real del producto activo es ≤$5.000, no $7.000 (ver
`config/producto-actual.json`).

## Delivery rate (tasa de entrega) — la métrica que Meta no te muestra

Es el % de pedidos creados que Dropi efectivamente entrega y cobra. Se
calcula desde el panel de Dropi (o el CSV exportado, ver
`docs/research.md`), no desde Meta:

```
delivery rate = pedidos entregados / pedidos creados
```

Referencia orientativa para COD en Chile: **60-75%** suele considerarse un
rango razonable/saludable; por debajo de **50%** sostenido es señal de
alerta (revisar calidad del tráfico, claridad de la oferta, o el guion de
confirmación telefónica del pedido si lo usas).

## ROAS reportado vs. ROAS efectivo

- **ROAS reportado** (el que muestra Meta Ads Manager): usa el valor de
  *todos* los pedidos creados, se entreguen o no. Optimista por
  definición en COD.
- **ROAS efectivo** (el que importa de verdad): usa solo el valor de los
  pedidos **entregados y cobrados**.

```
ROAS efectivo ≈ ROAS reportado × delivery rate
```

Ejemplo: si Meta reporta un ROAS de 3.0 pero tu delivery rate real es
65%, tu ROAS efectivo aproximado es 3.0 × 0.65 ≈ **1.95** — bastante más
ajustado. Cruzar este número periódicamente (semanal, al menos) contra el
panel de Dropi es la única forma de saber si realmente estás ganando
plata. Automatizar este cruce es justamente lo que queda anotado para
Fase 2 en `TODO.md` — por ahora se hace a mano.

## Siguiente paso

Con esto puedes leer si una campaña va bien o mal. Para decidir qué hacer
al respecto (pausar, esperar, o subir presupuesto), sigue a
[`04-reglas-matar-escalar.md`](./04-reglas-matar-escalar.md).
