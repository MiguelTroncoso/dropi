# Calculadora de margen — viabilidad COD

Script: [`packages/calc-margen/src/calc-margen.ts`](../packages/calc-margen/src/calc-margen.ts)
Config del producto activo: [`config/producto-actual.json`](../config/producto-actual.json)

## Por qué no basta la regla simple "vender 2,5-3x el costo"

La regla clásica de dropshipping dice: *si vendes al menos 2,5-3 veces el
costo (producto + envío), hay margen suficiente para pagar ads y quedarte
con utilidad.* Es un buen filtro rápido, pero **en COD chileno no es
suficiente por sí sola**, porque no considera que:

- Un porcentaje de los pedidos **se rechaza o no se puede entregar**, y ese
  costo de producto + envío de ida (y a veces envío de vuelta) **ya se
  gastó** cuando el courier despachó el paquete.
- El **CPA se paga por cada pedido creado**, se entregue o no.

Por eso esta calculadora hace dos análisis en paralelo:

1. **Regla simple** (2,5x-3x): filtro rápido de "¿el margen bruto teórico
   alcanza?", sin mirar rechazo ni CPA.
2. **Análisis COD real**: calcula el margen **esperado por cada pedido
   creado**, ponderando por la probabilidad de que se entregue o se
   rechace, y restando el CPA. Este es el número que de verdad importa
   para decidir si escalar o pausar una campaña.

## La fórmula (análisis COD real)

Con `p = tasa de rechazo esperada` (ej. 0.30 para 30%):

```
probEntrega = 1 - p
comisionDropi = precioVenta × %comisiónDropi
ingresoNetoPorEntrega = precioVenta − comisionDropi − otrosCostosFijos

ingresoEsperadoPorPedidoCreado = probEntrega × ingresoNetoPorEntrega

# El producto y el envío de ida se pagan en TODOS los pedidos creados,
# porque Dropi despacha antes de saber si el cliente va a rechazar.
costoLogisticoEsperadoPorPedidoCreado =
    costoProducto + envío + p × envíoDevolución

margenEsperadoAntesDeAds =
    ingresoEsperadoPorPedidoCreado − costoLogisticoEsperadoPorPedidoCreado

margenEsperadoConCPA = margenEsperadoAntesDeAds − CPA

cpaMáximoViable = margenEsperadoAntesDeAds   # CPA que deja margen en $0
```

**Veredicto:**

- `margenEsperadoConCPA ≤ 0` → **NO VIABLE** (se pierde plata en promedio
  por cada pedido creado).
- `margenEsperadoConCPA > 0` pero el margen es menor al **15% del precio de
  venta** → **RIESGOSO** (hay utilidad, pero cualquier alza en rechazo,
  envío o CPA la puede borrar).
- Margen ≥ 15% del precio de venta → **VIABLE**.

Estos umbrales son un punto de partida razonable, no una ley física —
ajústalos en el código si tu tolerancia al riesgo es distinta.

## Ejemplo real: Producto #1 (Compresor Digital Inflador de Aire)

Datos del producto (`config/producto-actual.json`):

| Variable | Valor |
|---|---|
| Precio de venta | $29.990 |
| Costo Dropi | $7.500 |
| Envío (real, tabla Blue Express del panel Dropi, tier S — blended Santiago/regiones) | $4.500 |
| Envío de devolución (mismo tier) | $4.500 |
| Comisión Dropi (estimado, ~5% reportado) | 5% |
| Tasa de rechazo (estimado, punto de partida típico COD — **aún sin confirmar con datos reales**) | 30% |
| CPA objetivo del operador | bajo $7.000 |

Corriendo la calculadora con estos valores (`npm run calc-margen --`, sin
flags, usa el config por defecto):

```
Regla simple (precio ≥ 2.5-3x costo base = producto + envío):
  Múltiplo actual: 2.50x (mínimo 2.5x, óptimo 3x)
  ❌ Cumple mínimo 2.5x
  ❌ Cumple óptimo 3x

Análisis COD real (ponderado por probabilidad de entrega):
  Prob. de entrega / rechazo:     70.0% / 30.0%
  Ingreso esperado por pedido creado:  $19.943
  Costo logístico esperado por pedido: $13.350
  Margen esperado ANTES de ads:        $6.593
  Margen esperado DESPUÉS del CPA:     $-407 (-1.4% del precio de venta)
  CPA máximo viable (breakeven):       $6.593

Veredicto: ❌ NO VIABLE
```

### Lectura del resultado

- Con el envío real de Blue Express ($4.500 blended, más alto que el
  estimado inicial de $3.990), el compresor **ya no pasa ni la regla
  simple de 2,5x** al CPA objetivo declarado de $7.000.
- El dato clave: con 30% de rechazo, el **CPA máximo viable (breakeven) es
  ~$6.593** — por debajo del "CPA objetivo: bajo $7.000" original. Es
  decir, ese objetivo declarado ya no alcanza con el envío real; hay que
  apuntar más bajo.
- Comparado contra otros candidatos evaluados (masajeador de cuello/
  hombros, secador de ropa portátil, irrigador bucal, cremas, etc. — todos
  descartados por costo alto vs. precio de mercado real, o ticket
  demasiado bajo), el compresor sigue siendo el mejor punto de partida: es
  el que tiene el envío más barato de todos (tier S en vez de M), aunque
  igual requiere CPA controlado.

- Si el CPA baja a $5.000 y la tasa de rechazo baja a 20% (con mejor
  calificación de leads, confirmación telefónica, etc.), el mismo producto
  pasa a **VIABLE** con margen saludable:

```
npm run calc-margen -- --cpa 5000 --rechazo 20
# → Margen esperado DESPUÉS del CPA: $4.892 (16.3%) — VIABLE
```

**Conclusión accionable:** el compresor solo es viable si el CPA se
mantiene bien por debajo de $7.000 (idealmente ≤$5.000) y la tasa de
rechazo se controla cerca de 20-25%. Prioridades antes/durante el
lanzamiento:

1. Confirmar que el compresor efectivamente cae en el tier de envío S de
   Blue Express (≤3kg, 20x20x30cm) y no en el tier M — si es M, el envío
   real es más alto todavía y hay que volver a correr el número.
2. Apuntar a un CPA bien por debajo de $7.000 (idealmente $5.000 o menos)
   en las primeras optimizaciones, no usar $7.000 como "meta cómoda" — a
   ese CPA el producto pierde plata.
3. Vigilar la tasa de rechazo desde el primer lote de pedidos —si se
   mantiene sobre 30%, revisar guion de confirmación de pedido / calidad
   del tráfico antes de seguir escalando presupuesto.

## Cómo correrla con tus propios números

```bash
npm install   # una sola vez, desde la raíz del monorepo
npm run calc-margen -- --precio 29990 --costo 7500 --envio 4500 --rechazo 30 --cpa 5000
```

Ver todos los flags: `npm run calc-margen -- --help`.

Para dejar un nuevo producto como el "activo" del proyecto (y que todos los
paquetes que lean `config/producto-actual.json` usen sus datos), edita ese
archivo directamente — no hace falta tocar el script.
