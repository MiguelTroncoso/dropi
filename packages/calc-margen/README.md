# @dropi-shopify-chile/calc-margen

Calculadora de viabilidad de margen para productos COD (Dropi + Shopify
Chile). Ver el detalle de la fórmula y ejemplos en
[`docs/calculadora-margen.md`](../../docs/calculadora-margen.md).

## Uso

```bash
# Desde la raíz del monorepo
npm install
npm run calc-margen -- --precio 29990 --costo 7500 --envio 3990 --rechazo 30 --cpa 6500

# O desde este paquete
cd packages/calc-margen
npm run calc-margen -- --precio 29990 --costo 7500 --envio 3990 --rechazo 30 --cpa 6500
```

Si no pasas flags, usa los valores de
[`config/producto-actual.json`](../../config/producto-actual.json) en la
raíz del monorepo (el producto activo a validar). Para cambiar de producto,
edita ese archivo — no hace falta tocar código.

Ver todos los flags disponibles:

```bash
npm run calc-margen -- --help
```

Salida en JSON (útil para scripting o para una futura Fase 2):

```bash
npm run calc-margen -- --json
```
