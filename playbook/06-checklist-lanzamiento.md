# 06 — Checklist final antes de lanzar

Revisa todo esto antes de activar la campaña y gastar el primer peso. Está
agrupado por área; cada punto enlaza a dónde resolverlo si falta.

## Producto y viabilidad

- [ ] Corriste la calculadora de margen con los datos reales (no solo
      estimados) de costo de envío y comisión de tu panel Dropi:
      `npm run calc-margen`. Ver
      [`docs/calculadora-margen.md`](../docs/calculadora-margen.md).
- [ ] El veredicto es VIABLE o RIESGOSO-pero-entendido (si es RIESGOSO,
      sabes exactamente qué CPA/rechazo lo vuelve NO_VIABLE, y estás
      dispuesto a pausar si se cruza ese umbral — ver Guía 04).
- [ ] Confirmaste el stock disponible real en tu panel Dropi
      (`config/producto-actual.json` → `stockDisponible` sigue siendo
      correcto).

## Legal

- [ ] Inicio de actividades SII + boleta electrónica habilitada.
- [ ] Página de Política de Privacidad publicada en la tienda.
- [ ] Página de Política de Cambios/Devoluciones y Retracto publicada.
- [ ] Datos del vendedor (razón social, RUT, contacto) visibles en el
      sitio.
- [ ] Email de confirmación automática de pedido funcionando (lo maneja
      Shopify vía `send_receipt: true` en `storefront/server`, pero
      verifícalo con un pedido de prueba).
- [ ] Consentimiento de datos personales visible en el formulario COD.

Detalle completo:
[`docs/checklist-legal-chile.md`](../docs/checklist-legal-chile.md).

## Storefront (tema + servidor)

- [ ] `storefront/server` desplegado y corriendo (Docker, en tu VPS),
      `.env` completo con las credenciales reales (no las de prueba).
- [ ] `META_TEST_EVENT_CODE` **sacado** del `.env` del servidor después de
      probar (para que los eventos reales no queden marcados como test).
- [ ] Sección "Landing COD" configurada en el editor de temas: producto
      correcto seleccionado, URL del servidor pegada, Pixel ID y GA4
      Measurement ID pegados, textos de beneficios/prueba
      social/escasez/garantía revisados.
- [ ] Hiciste un pedido de prueba de punta a punta y confirmaste:
      - Se crea la orden en Shopify (estado Pendiente, tag `COD`).
      - Llega el email de confirmación.
      - El evento `Purchase` aparece en Meta Events Manager (deduplicado
        entre navegador y servidor) y en GA4 DebugView.
      - La app Dropify sincroniza la orden hacia Dropi (revísalo en el
        panel de Dropi).
- [ ] Probaste el flujo completo **en un celular real**, no solo en el
      computador — es tráfico 100% móvil.

Detalle completo: [`storefront/README.md`](../storefront/README.md).

## Cuenta publicitaria

- [ ] Business Manager, página, cuenta publicitaria (zona horaria
      Santiago, moneda CLP) y método de pago listos.
- [ ] Dominio verificado en el Business Manager.
- [ ] Evento `Purchase` verificado/reconocido para tu dominio en Events
      Manager.

Detalle completo:
[`01-setup-inicial.md`](./01-setup-inicial.md).

## Campaña

- [ ] Estructura simple: 1 campaña (CBO), 1 ad set, público amplio,
      ubicaciones automáticas, optimizando a `Purchase`.
- [ ] Presupuesto diario ≥ 3-4x tu CPA objetivo real (según la
      calculadora, no el número redondo genérico).
- [ ] 3-4 creativos listos, cubriendo ángulos distintos entre sí.

Detalle completo:
[`02-campana-facebook-paso-a-paso.md`](./02-campana-facebook-paso-a-paso.md).

## Después de lanzar

- [ ] Agendado revisar métricas **una vez al día** (no cada hora) —
      ver [`03-lectura-de-metricas.md`](./03-lectura-de-metricas.md).
- [ ] Sabes las reglas de pausar/escalar de memoria, o al menos las
      tienes a mano —
      [`04-reglas-matar-escalar.md`](./04-reglas-matar-escalar.md).
- [ ] Definiste cuándo vas a revisar el panel de Dropi para calcular el
      delivery rate real y el ROAS efectivo (recomendado: semanal como
      mínimo los primeros meses).

Si todo lo de arriba está marcado, estás listo para activar la campaña.
