# @dropi-shopify-chile/creative-kit

Genera, en español de Chile, el kit de creativos para lanzar el producto
activo: 5 ángulos de venta, 10 hooks de video, 3 guiones UGC grabables con
celular, 3 copies de Facebook, specs de imágenes para Canva, y un brief
para pedir UGC (a un creador o para grabarlo tú mismo).

## Uso

```bash
# Desde la raíz del monorepo
npm install
npm run generar --workspace=creative-kit

# O desde este paquete
cd creative-kit
npm run generar
```

Por defecto lee [`config/producto-actual.json`](../config/producto-actual.json)
y guarda el resultado en `creative-kit/output/<id-del-producto>.md`. Ya hay
un ejemplo generado para el Producto #1 en
[`output/compresor-aire-portatil.md`](./output/compresor-aire-portatil.md).

Para regenerarlo (por ejemplo, después de editar los textos de
`marketing` en el config) o generar el de otro producto:

```bash
npm run generar -- --stdout            # además de guardar, lo imprime en consola
npm run generar -- --config otro.json  # usa otro archivo de producto
npm run generar -- --out otra-ruta.md  # cambia dónde se guarda
```

## Cómo cambiar de producto

El contenido sale de `config/producto-actual.json`, específicamente del
bloque `marketing` (beneficios, problema que resuelve, público objetivo,
diferenciadores, objeciones comunes, prueba social, garantía y escasez).
Edita esos campos para el nuevo producto y vuelve a correr `npm run
generar` — no hace falta tocar el código.

El resultado es un punto de partida sólido, no un texto final: revísalo y
ajústalo con tu criterio antes de usarlo en campaña, sobre todo las
afirmaciones de beneficios (que sean ciertas para el producto real que
llega en la caja).
