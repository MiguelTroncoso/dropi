# 04 — Reglas para pausar (matar) o escalar

Reglas concretas para no decidir "a ojo" ni por ansiedad de estar mirando
el Ads Manager cada hora. Revisa esto **una vez al día**, no cada rato —
mirar métricas cada 2 horas en una campaña con presupuesto chico solo
genera ruido, no señal.

## Antes de aplicar cualquier regla: ¿ya salió de la fase de aprendizaje?

No apliques estas reglas antes de las 48-72h iniciales ni antes de tener
al menos ~15-20 conversiones del evento `Purchase` acumuladas. Con menos
datos que eso, cualquier "mal resultado" puede ser solo ruido estadístico,
no una señal real.

## Cuándo pausar (matar)

Pausa la campaña/anuncio si se cumple **cualquiera** de estas, después de
la fase de aprendizaje:

1. **Gasto ≥ 3-4x el CPA objetivo con cero pedidos creados.** Con el CPA
   objetivo de este proyecto (≤$5.000, ver `config/producto-actual.json`),
   eso es gastar ~$15.000-$20.000 sin un solo `Purchase`. Es una señal
   fuerte de que la oferta/creativo/landing no está conectando, no solo
   mala suerte.
2. **CPA real sostenido (varios días, no un solo día malo) por encima del
   CPA máximo viable** que te da la calculadora de margen para tu tasa de
   rechazo actual (no el CPA objetivo genérico — el número real de tu
   producto, ver Guía 03 y `docs/calculadora-margen.md`).
3. **Delivery rate cae sostenido bajo ~40-50%**, aunque el CPA en Meta se
   vea bien. Esto es plata que se está yendo en despachos que vuelven —
   revisa el guion de confirmación de pedido, la calidad del tráfico (¿el
   anuncio promete algo que el formulario/producto no cumple?), o si hay
   un problema de cobertura de despacho en ciertas comunas.
4. **CTR muy por debajo de lo normal en tu cuenta Y CPA alto** al mismo
   tiempo — el creativo no engancha y encima no convierte. Antes de
   pausar del todo, primero prueba reemplazar el creativo (ver Guía 05)
   si el resto de la campaña (oferta, precio, landing) ya está validado.

Pausar no es fracaso — es información. Anota qué ángulo/creativo/oferta se
probó y por qué se pausó, para no repetir la misma prueba sin darte
cuenta.

## Cuándo escalar

Sube presupuesto si se cumple **todo esto** a la vez, sostenido por al
menos 3 días (no un solo día bueno):

1. CPA real bajo el CPA máximo viable de la calculadora, con margen de
   sobra (no justo al límite).
2. Delivery rate en rango saludable (~60%+).
3. Volumen de pedidos creados por día que ya te da algo de confianza
   estadística (idealmente 10+ al día antes de escalar fuerte).

### Cómo escalar sin romper el aprendizaje

- **Incrementos de 20-30% cada 2-3 días**, no duplicar de golpe. Un salto
  brusco de presupuesto reinicia la fase de aprendizaje igual que crear
  una campaña nueva.
- Si necesitas escalar más rápido, es mejor **duplicar la campaña
  completa** (con el mismo público amplio y los mismos creativos
  ganadores) y subir el presupuesto ahí, dejando la original corriendo
  como está, que forzar un salto grande en la misma campaña.
- Sigue viendo el delivery rate mientras escalas — es común que al subir
  mucho el volumen, la calidad del tráfico baje un poco y el rechazo
  suba. Si el ROAS efectivo (Guía 03) empieza a caer al escalar, frena el
  ritmo de subida antes de seguir.

## Señal de competencia como apoyo a la decisión

Si estás dudando entre seguir probando este producto/ángulo o cambiar de
estrategia, una señal adicional (no reemplaza las reglas de arriba, las
complementa) es mirar la Meta Ad Library:

- ¿Hay anunciantes con el mismo tipo de producto corriendo el **mismo
  anuncio 5-7+ días seguidos**? Buena señal de que la categoría/ángulo
  funciona en general.
- ¿Ese mismo anunciante tiene **varias variaciones activas** del
  producto? Señal de que ya validó y está escalando, no solo probando.

**No mires el contador de "impresiones" de la biblioteca de anuncios para
esto** — ver `docs/research.md` para la explicación completa de por qué ese
número (requisito DSA de la Unión Europea) no refleja rendimiento en
Chile.

## Siguiente paso

Si vas a reemplazar creativos (por CTR bajo o para escalar con contenido
nuevo), sigue a [`05-creativos.md`](./05-creativos.md).
