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
| Envío (estimado, **ajustar con tu panel Dropi**) | $3.990 |
| Envío de devolución (estimado) | $3.990 |
| Comisión Dropi (estimado, ~5% reportado) | 5% |
| Tasa de rechazo (estimado, punto de partida típico COD) | 30% |
| CPA objetivo del operador | bajo $7.000 |

Corriendo la calculadora con estos valores (`npm run calc-margen --`, sin
flags, usa el config por defecto):

```
Regla simple (precio ≥ 2.5-3x costo base = producto + envío):
  Múltiplo actual: 2.61x (mínimo 2.5x, óptimo 3x)
  ✅ Cumple mínimo 2.5x
  ❌ Cumple óptimo 3x

Análisis COD real (ponderado por probabilidad de entrega):
  Prob. de entrega / rechazo:     70.0% / 30.0%
  Ingreso esperado por pedido creado:  $19.943
  Costo logístico esperado por pedido: $12.687
  Margen esperado ANTES de ads:        $7.256
  Margen esperado DESPUÉS del CPA:     $256 (0.9% del precio de venta)
  CPA máximo viable (breakeven):       $7.256

Veredicto: ⚠️ RIESGOSO
```

### Lectura del resultado

- El producto **sí cumple** la regla simple mínima de 2,5x (2,61x), pero
  **no llega** al 3x óptimo.
- El dato importante: con 30% de rechazo, el **CPA máximo viable
  (breakeven) es ~$7.256**. El CPA objetivo declarado por el operador
  ("bajo $7.000") está *justo debajo* de ese techo — es decir, el objetivo
  de CPA es correcto en dirección, pero deja un colchón mínimo (~$256 por
  pedido creado, menos del 1% del precio de venta). Cualquiera de estos
  eventos lo vuelve **NO VIABLE**:
  - La tasa de rechazo real resulta mayor a 30% (muy posible en el primer
    tramo de campaña, antes de optimizar públicos/creativos).
  - El envío real (una vez confirmado en el panel Dropi) es más caro que
    el estimado de $3.990.
  - El CPA real supera $7.000 en la práctica (habitual las primeras 48-72h
    de una campaña nueva, ver `playbook/02-campana-facebook-paso-a-paso.md`
    en Fase 1).

- Si la tasa de rechazo baja a 20% (con mejor calificación de leads, script
  de confirmación telefónica, etc.) y el CPA baja a $5.000, el mismo
  producto pasa a **VIABLE** con ~18% de margen sobre precio de venta:

```
npm run calc-margen -- --cpa 5000 --rechazo 20
# → Margen esperado DESPUÉS del CPA: $5.504 (18.4%) — VIABLE
```

**Conclusión accionable:** el compresor es viable para lanzar una prueba,
pero **con margen de maniobra casi nulo si el CPA se acerca a $7.000 o el
rechazo supera 30%**. Prioridades antes/durante el lanzamiento:

1. Confirmar el costo de envío real en el panel Dropi para este producto
   específico (el $3.990 es una estimación) y volver a correr la
   calculadora con el valor real.
2. Apuntar a un CPA bien por debajo de $7.000 en las primeras
   optimizaciones, no usarlo como "meta cómoda".
3. Vigilar la tasa de rechazo desde el primer lote de pedidos —si supera
   30% de forma sostenida, revisar guion de confirmación de pedido /
   calidad del tráfico antes de seguir escalando presupuesto.

## Cómo correrla con tus propios números

```bash
npm install   # una sola vez, desde la raíz del monorepo
npm run calc-margen -- --precio 29990 --costo 7500 --envio 3990 --rechazo 30 --cpa 6500
```

Ver todos los flags: `npm run calc-margen -- --help`.

Para dejar un nuevo producto como el "activo" del proyecto (y que todos los
paquetes que lean `config/producto-actual.json` usen sus datos), edita ese
archivo directamente — no hace falta tocar el script.
