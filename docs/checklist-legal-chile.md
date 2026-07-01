# Checklist legal — mínimos para vender online en Chile

> **Esto no es asesoría legal.** Es un checklist operativo con lo mínimo
> que un vendedor online chileno individual/SPA debería tener resuelto
> antes de gastar el primer peso en ads. Para dudas específicas de tu
> situación tributaria o societaria, consulta a un contador/abogado.

## 1. Boleta electrónica (SII)

- [ ] Tener **inicio de actividades** ante el SII con giro habilitado para
      venta de este tipo de producto (comercio, venta al por menor, etc.).
- [ ] Estar habilitado para **facturación/boleta electrónica** (certificado
      digital emitido por entidad acreditada, o usar el sistema gratuito
      de boleta electrónica del SII si tu volumen califica).
- [ ] La **boleta se emite en el momento del pago**, no después. En un
      flujo COD esto significa: al momento en que el courier cobra al
      cliente en la puerta, debe quedar una boleta asociada a esa venta.
      Definir con Dropi/tu operación quién dispara la emisión (tú, vía tu
      sistema, apenas se confirma el pago) — no dejarlo para "cuadrar
      después".
- [ ] Desde 2026, si no cuentas con impresora en el punto de entrega,
      la boleta debe poder **enviarse en formato digital** (correo,
      SMS/WhatsApp o QR) — dejar definido cómo se le hace llegar la boleta
      al cliente en una entrega a domicilio sin POS físico.
- [ ] Guardar boletas emitidas de forma ordenada (exportable) para
      declaraciones de IVA mensuales.

## 2. Ley del Consumidor (Ley 19.496) — derecho a retracto

- [ ] Informar **de forma clara y visible** en el sitio (footer, página de
      "Política de cambios y devoluciones", y checkout) que el cliente
      tiene **derecho a retracto de 10 días corridos** desde que recibe el
      producto, sin necesidad de justificar el motivo, por tratarse de una
      compra a distancia/electrónica.
- [ ] Explicar el procedimiento: cómo contactar para ejercer el retracto,
      que el producto debe devolverse **sin uso** y en condiciones
      similares a como se recibió, y que debe presentarse la boleta o
      comprobante de compra.
- [ ] **Ojo con el plazo extendido**: si no envías una confirmación escrita
      del contrato/compra al cliente (ej. email de confirmación de pedido
      con los datos de la compra), el plazo de retracto se extiende
      automáticamente a **90 días**. Conclusión práctica: automatizar el
      email/WhatsApp de confirmación de pedido no es opcional, es lo que
      te mantiene en la ventana de 10 días.
- [ ] Definir explícitamente si hay **exclusiones** aplicables al producto
      (ej. productos usados, higiénicos, hechos a medida — no aplica al
      compresor de aire portátil, pero sí puede aplicar a futuros
      productos del catálogo) y dejarlas declaradas en la política.
- [ ] No confundir "derecho a retracto" con "garantía legal" (fallas del
      producto) — son derechos distintos y ambos deben estar
      documentados por separado.

## 3. Protección de datos personales (Ley 19.628, y Ley 21.719 en régimen transitorio)

- [ ] Tener una **Política de Privacidad** publicada y accesible (link en
      footer y en el formulario COD) que indique como mínimo:
      - Qué datos personales se piden (nombre, teléfono, dirección, comuna,
        región — exactamente los campos del formulario COD).
      - Para qué se usan (procesar el pedido, contactar para coordinar
        entrega, cobrar contra entrega).
      - Con quién se comparten (Dropi y la transportadora asignada, Meta
        para efectos de píxel/Conversions API si aplica, Shopify como
        plataforma).
      - Cuánto tiempo se conservan y cómo se pueden solicitar eliminar.
- [ ] El **consentimiento** para recolectar y usar los datos debe ser
      informado y explícito (ej. checkbox o texto claro junto al botón de
      "Confirmar pedido", no un checkbox pre-marcado escondido).
- [ ] Medidas técnicas mínimas: formulario servido por HTTPS (Shopify lo da
      por defecto), no loggear datos personales en texto plano en sistemas
      de terceros innecesarios, no reenviar datos de clientes a nadie fuera
      de Dropi/transportadora/Meta-Shopify-GA4 sin necesidad.
- [ ] Ley 21.719 (reforma) entra en régimen pleno el **1 de diciembre de
      2026** — no es urgente para el lanzamiento inicial, pero si el
      negocio sigue operando después de esa fecha, revisar si aplican
      obligaciones adicionales (ej. registro de tratamiento de datos si el
      volumen lo amerita).

## 4. Información comercial obligatoria en el sitio

- [ ] Identificación del vendedor: razón social, RUT, dirección, medio de
      contacto (email/WhatsApp) — visible en el sitio, no escondido.
- [ ] Precio final en CLP, IVA incluido, sin costos ocultos que aparezcan
      recién en el checkout.
- [ ] Condiciones de envío: plazo estimado de entrega, cobertura (regiones
      donde Dropi/tus transportadoras efectivamente llegan), y qué pasa si
      el pedido se rechaza o no se puede entregar (quién asume, qué le
      pasa al cliente si quiere reintentar).
- [ ] Medios de pago aceptados dejados claros (en este caso: pago contra
      entrega en efectivo/débito según lo que soporte la transportadora).

## 5. Antes de lanzar la primera campaña — resumen accionable

- [ ] Inicio de actividades SII + boleta electrónica habilitada.
- [ ] Página de Política de Privacidad publicada.
- [ ] Página de Política de Cambios/Devoluciones y Retracto publicada.
- [ ] Datos del vendedor (razón social, RUT, contacto) visibles en el
      sitio.
- [ ] Email/WhatsApp de confirmación automática de pedido configurado
      (para mantener la ventana de retracto en 10 días, no 90).
- [ ] Checkbox o texto de consentimiento de datos personales en el
      formulario COD.

Este checklist se referencia desde `playbook/06-checklist-lanzamiento.md`
en Fase 1, donde se integra al checklist operativo completo (ads +
legal + logística).

## Fuentes consultadas

- [SII — Boleta de ventas y servicios electrónica](https://www.sii.cl/servicios_online/3532-.html)
- [Boleta electrónica obligatoria en Chile 2026 — Tuu](https://blog.tuu.cl/boleta-electronica-obligatoria-en-chile-2026-que-cambia-y-como-debe-entregarse)
- [SERNAC — Derecho a retracto](https://www.sernac.cl/portal/617/w3-propertyvalue-64530.html)
- [Ley 19.496, artículo 3 bis — SERNAC Jurídico](https://www.sernac.cl/portal/609/w3-propertyvalue-58897.html)
- [¿Te arrepentiste de una compra por internet? — BioBioChile](https://www.biobiochile.cl/noticias/servicios/toma-nota/2025/10/09/te-arrepentiste-de-una-compra-por-internet-asi-funciona-el-derecho-a-retracto-en-chile.shtml)
- [Ley 19.628 — Biblioteca del Congreso Nacional](https://www.bcn.cl/leychile/navegar?idNorma=141599)
- [Ley 21.719: reforma de protección de datos en Chile — Idónea](https://idonea.cl/3181-2/)
- [Políticas de Privacidad y Protección de Datos — SERNAC](https://www.sernac.cl/portal/617/w3-article-53061.html)
