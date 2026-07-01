# Dropi + Shopify Chile — lanzamiento y validación COD

Monorepo TypeScript para lanzar y validar, por fases, un negocio de
dropshipping local en Chile con **Dropi** (fulfillment + pago contra
entrega) y **Shopify** (tienda), validando productos con **Facebook Ads**.

Antes de tocar nada, lee **[`CLAUDE.md`](./CLAUDE.md)** (idéntico a
`AGENTS.md`) — tiene el contexto completo del negocio, el principio COD, y
qué se puede/no se puede hacer en cada fase.

## Estado actual: Fase 0 (research + calculadora)

- ✅ [`docs/research.md`](./docs/research.md) — integración Dropi↔Shopify
  (API, webhooks, plan B con CSV) y cómo interpretar la Meta Ad Library sin
  caer en el dato engañoso de "impresiones" (DSA/UE).
- ✅ [`docs/checklist-legal-chile.md`](./docs/checklist-legal-chile.md) —
  mínimos legales para vender online en Chile (boleta electrónica,
  retracto, datos personales).
- ✅ [`docs/calculadora-margen.md`](./docs/calculadora-margen.md) +
  [`packages/calc-margen`](./packages/calc-margen) — calculadora de
  viabilidad de margen para COD, corrida ya con los datos del Producto #1.
- ⏳ `storefront/`, `creative-kit/`, `playbook/` (Fase 1) — **pendientes de
  tu confirmación** después de revisar lo de arriba.
- 🚫 Automatización de métricas / dashboard (Fase 2) — ver
  [`TODO.md`](./TODO.md), no se toca todavía.

## Producto #1 a validar

Compresor Digital Inflador de Aire (Dropi, proveedor Vida y Hogar SPA).
Parametrizado en [`config/producto-actual.json`](./config/producto-actual.json)
para poder cambiar de producto sin tocar código.

## Setup

```bash
npm install
npm run calc-margen -- --help
```

Node >= 20. Cada paquete del monorepo tiene su propio README con detalle.

## Estructura

```
config/                 Datos del producto activo (parametrizable)
docs/                   Research, checklist legal, calculadora de margen
packages/calc-margen/   Script CLI de viabilidad de margen COD
TODO.md                 Alcance de Fase 2 (no construir todavía)
```
