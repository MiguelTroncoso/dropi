# Dropi + Shopify Chile — lanzamiento y validación COD

Monorepo TypeScript para lanzar y validar, por fases, un negocio de
dropshipping local en Chile con **Dropi** (fulfillment + pago contra
entrega) y **Shopify** (tienda), validando productos con **Facebook Ads**.

Antes de tocar nada, lee **[`CLAUDE.md`](./CLAUDE.md)** (idéntico a
`AGENTS.md`) — tiene el contexto completo del negocio, el principio COD, y
qué se puede/no se puede hacer en cada fase.

## Estado actual: Fase 1 completa (research de Fase 0 + entregables de lanzamiento)

**Fase 0 — research y viabilidad:**

- ✅ [`docs/research.md`](./docs/research.md) — integración Dropi↔Shopify
  (API, webhooks, plan B con CSV) y cómo interpretar la Meta Ad Library sin
  caer en el dato engañoso de "impresiones" (DSA/UE).
- ✅ [`docs/checklist-legal-chile.md`](./docs/checklist-legal-chile.md) —
  mínimos legales para vender online en Chile (boleta electrónica,
  retracto, datos personales).
- ✅ [`docs/calculadora-margen.md`](./docs/calculadora-margen.md) +
  [`packages/calc-margen`](./packages/calc-margen) — calculadora de
  viabilidad de margen para COD, corrida ya con los datos del Producto #1.

**Fase 1 — entregables de lanzamiento:**

- ✅ [`storefront/`](./storefront) — landing Shopify de conversión COD
  (tema Liquid/CSS/JS) + servidor Node/TS Dockerizado que crea la orden en
  Shopify y dispara Meta Conversions API + GA4 Measurement Protocol
  server-side.
- ✅ [`creative-kit/`](./creative-kit) — generador de ángulos, hooks,
  guiones UGC, copies de Facebook, specs de imágenes y brief UGC, ya
  corrido para el Producto #1.
- ✅ [`playbook/`](./playbook) — 6 guías paso a paso para lanzar y correr
  la campaña de Facebook Ads siendo principiante.

**Fase 2 — automatización de métricas y dashboard:** no se toca todavía,
ver [`TODO.md`](./TODO.md).

## Producto #1 a validar

Compresor Digital Inflador de Aire (Dropi, proveedor Vida y Hogar SPA).
Parametrizado en [`config/producto-actual.json`](./config/producto-actual.json)
para poder cambiar de producto sin tocar código (incluye datos financieros
para la calculadora de margen y datos de marketing para el creative-kit).

## Antes de lanzar

Sigue [`playbook/06-checklist-lanzamiento.md`](./playbook/06-checklist-lanzamiento.md)
como checklist final — cruza legal, storefront, cuenta publicitaria y
campaña. No hay credenciales reales commiteadas en este repo: cada `.env`
que falta completar indica exactamente qué generar y dónde pegarlo (ver
[`storefront/server/README.md`](./storefront/server/README.md) y
[`playbook/01-setup-inicial.md`](./playbook/01-setup-inicial.md)).

## Setup

```bash
npm install
npm run calc-margen -- --help
npm run generar --workspace=creative-kit -- --help
```

Node >= 20. Cada paquete del monorepo tiene su propio README con detalle.
`storefront/server` es un proyecto Node standalone (no un workspace de
npm) para que su `Dockerfile` sea simple y autocontenido — instálalo desde
su propia carpeta (`cd storefront/server && npm install`).

## Estructura

```
config/                 Datos del producto activo (parametrizable)
docs/                   Research, checklist legal, calculadora de margen
packages/calc-margen/   Script CLI de viabilidad de margen COD
creative-kit/           Generador de ángulos, hooks, guiones UGC y copies
storefront/             Landing Shopify COD (theme/) + servidor CAPI+GA4 (server/)
playbook/               Guías paso a paso para Facebook Ads (principiante)
TODO.md                 Alcance de Fase 2 (no construir todavía)
```
