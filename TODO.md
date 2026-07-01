# TODO — Fase 2 (no construir todavía)

Anotado para no perderlo, pero **fuera de alcance** hasta que el operador lo
pida explícitamente después de validar el Producto #1 en Fase 1.

## Automatización de métricas

- Conectores de reporting para **Meta Ads**, **TikTok Ads**, **Shopify** y
  **Dropi** (vía API de integraciones, ver `docs/research.md`).
- Cálculo de **ROAS efectivo real**: ingresos de pedidos *entregados y
  cobrados* en Dropi (no "ventas" creadas en Shopify) dividido por gasto
  publicitario real del período. Requiere cruzar pedido Shopify ↔ pedido
  Dropi ↔ estado de entrega.
- Job periódico (n8n en el VPS existente) que sincronice estados de
  entrega de Dropi hacia una base propia, dado que Dropi no expone
  webhooks públicos de cambio de estado (ver hallazgos en
  `docs/research.md`) — probablemente polling contra la API de
  integraciones o import periódico de CSV como fallback.

## Dashboard

- Vista única con: gasto por plataforma de ads, pedidos creados vs.
  entregados vs. rechazados, CPA real, ROAS efectivo, delivery rate por
  comuna/región, margen neto por producto.
- Alertas simples (ej. delivery rate cae bajo umbral, CPA sube sobre
  objetivo) — no antes de tener suficiente volumen de datos reales.

## Research-radar automatizado

- Monitoreo recurrente de la Meta Ad Library (scraping/consulta manual
  asistida, ya que la API oficial no cubre anuncios comerciales) para
  detectar anunciantes con anuncios corriendo ≥5-7 días y múltiples
  variaciones activas (señal de posible producto ganador, ver
  `docs/research.md`).
- Posible extensión a TikTok Creative Center y otras fuentes de research
  de productos.

## Notas

- Todo esto depende de tener datos reales de al menos unas semanas de
  campaña del Producto #1 corriendo — construir el dashboard antes tendría
  cero valor (no hay señal que mostrar) y distraería de la validación.
- Cuando se aborde esta fase, reutilizar `config/producto-actual.json`
  como fuente de config de producto activo, y extenderlo a un array de
  productos si para entonces hay más de uno en catálogo.
