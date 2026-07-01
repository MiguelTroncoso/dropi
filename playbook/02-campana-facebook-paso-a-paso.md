# 02 — Campaña de Facebook, paso a paso

Estructura simple a propósito. Como principiante, la peor estructura es la
más compleja: muchos ad sets, muchos públicos distintos, mucho ajuste
manual. Eso divide el presupuesto en pedazos tan chicos que el algoritmo de
Meta nunca junta suficiente señal para optimizar bien (esto se llama
"romper el aprendizaje").

## CBO vs ABO — cuál usar

- **ABO (Ad Set Budget Optimization):** tú defines el presupuesto por cada
  conjunto de anuncios. Útil cuando quieres forzar que cada público o cada
  set de creativos reciba un gasto mínimo garantizado, típicamente para
  comparar públicos entre sí.
- **CBO (Campaign Budget Optimization):** defines un solo presupuesto a
  nivel de campaña, y Meta lo reparte solo entre los ad sets según cuál
  está rindiendo mejor.

**Recomendación para este caso (COD, un solo producto, principiante):
CBO.** No estás comparando públicos distintos todavía (partes con público
amplio, ver abajo), así que no necesitas el control fino de ABO. CBO deja
que el algoritmo decida, que es justo lo que quieres cuando todavía no
tienes el criterio para decidir tú.

## Estructura recomendada para partir

```
1 Campaña (CBO activado, objetivo "Ventas"/"Conversiones")
  └── 1 Conjunto de anuncios (público amplio, ver abajo)
        └── 3-4 anuncios (creativos distintos, del creative-kit)
```

Un solo ad set. No lo dividas en "hombres" / "mujeres" / "intereses X" /
"intereses Y" al partir — eso es ABO con público segmentado, y sin datos
todavía es adivinar a ciegas. Deja que el algoritmo encuentre a quién
mostrarle el anuncio.

### Presupuesto diario inicial

Regla práctica: **presupuesto diario ≥ 3-4 veces tu CPA objetivo**, para
que en un día el algoritmo tenga margen de generar varias conversiones y
aprender, no solo 0 o 1.

Con el CPA objetivo de este proyecto (bajo $7.000, ver
`config/producto-actual.json`), eso da un piso de **~$21.000-$28.000
CLP/día**. Si tu presupuesto real es más ajustado, es mejor partir con
menos días de prueba pero el presupuesto diario mínimo, que estirar un
presupuesto chico en más ad sets o más días a un ritmo que nunca junta
señal.

### Público

- **Amplio (broad)**: sin intereses ni segmentación detallada. Solo:
  - Ubicación: Chile (o las regiones donde Dropi/tus transportadoras
    efectivamente entregan bien — revisa cobertura real antes de incluir
    zonas extremas).
  - Edad: un rango amplio razonable para el producto (para el compresor,
    algo como 25-55 es un punto de partida, no una regla fija).
  - Sin más filtros. El algoritmo de Meta hoy en día suele encontrar mejor
    audiencia con público amplio + buena optimización de evento, que con
    intereses manuales adivinados.

### Ubicaciones (placements)

- **Ubicaciones automáticas ("Advantage+ placements")**, no las
  selecciones a mano. Dejar que Meta reparta entre Feed, Reels, Stories,
  Audience Network según dónde rinda mejor — restringir manualmente al
  partir solo reduce volumen de datos sin beneficio claro.

### Optimización

- Objetivo de campaña: **Ventas** (conversiones).
- Evento de conversión: **Purchase** — el que dispara
  `storefront/theme/assets/cod-landing.js` y respalda
  `storefront/server` vía Conversions API cuando se crea el pedido COD
  (ver Guía 01). Confirma que Meta lo reconozca como "evento verificado"
  para tu dominio antes de lanzar (Events Manager → Diagnóstico).
- Ventana de conversión: la que venga por defecto (7 días clic / 1 día
  vista) está bien para partir.

## Qué NO tocar las primeras 48-72 horas

Cada vez que editas presupuesto de forma agresiva, cambias el público,
apagas y prendes el ad set, o editas el anuncio, **reinicias la fase de
aprendizaje** — el algoritmo vuelve a partir de cero en la práctica.

Durante las primeras 48-72 horas después de publicar:

- **No** subas ni bajes el presupuesto (salvo que esté claramente perdiendo
  plata sin ningún resultado — ver Guía 04 para el umbral exacto).
- **No** dupliques el ad set ni crees uno nuevo con "ligeras variaciones".
- **No** apagues y prendas la campaña.
- **No** cambies el público ni las ubicaciones.
- **Sí puedes** revisar métricas (Guía 03) para tener contexto, solo no
  actúes sobre ellas todavía — 48-72h y/o ~50 conversiones del evento
  optimizado es lo mínimo para que Meta salga de la fase de aprendizaje y
  las métricas empiecen a estabilizarse.

## Después de las 72 horas

Pasa a [`03-lectura-de-metricas.md`](./03-lectura-de-metricas.md) para
saber qué mirar, y a
[`04-reglas-matar-escalar.md`](./04-reglas-matar-escalar.md) para las
reglas de cuándo recién ahí tocar algo.
