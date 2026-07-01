# 05 — Creativos: grabar, editar y armar imágenes

No necesitas equipo profesional. Para COD en Chile, el video grabado con
celular suele rendir igual o mejor que producción "pulida" — se ve más
real, menos "publicidad".

Punto de partida: corre (o revisa) el creative-kit para tener ángulos,
hooks y guiones ya escritos antes de grabar:

```bash
npm run generar --workspace=creative-kit
```

Ya hay un ejemplo generado en
[`creative-kit/output/compresor-aire-portatil.md`](../creative-kit/output/compresor-aire-portatil.md).

## Grabar con el celular

- **Vertical (9:16), siempre.** Todo el consumo de estos anuncios es en
  el celular.
- **Luz natural**, de frente o levemente de lado a la persona/producto —
  nunca a contraluz (ventana detrás genera silueta oscura).
- **Estabilidad**: apoya el celular en algo o usa un trípode barato/
  soporte. Nada de cámara en mano temblando si no es un efecto buscado.
- **Sonido**: si vas a hablar a cámara, grábalo en un lugar sin ruido de
  fondo (viento, tráfico). Si el ambiente es ruidoso, mejor sin diálogo y
  agrega subtítulos/texto en edición.
- **Varias tomas por escena** (2-3 mínimo): en edición eliges la mejor,
  no confíes en que la primera toma va a estar perfecta.
- Sigue el guion escena por escena del creative-kit como punto de
  partida, no como libreto rígido — que se vea natural importa más que
  seguirlo palabra por palabra.

## Editar en CapCut

1. Importa los clips en orden (según el guion: problema → producto en
   acción → resultado → CTA).
2. **Corta lo muerto**: silencios largos, dudas, tomas repetidas. Un
   anuncio de 20-30 segundos rara vez necesita más de eso.
3. **Texto/subtítulos**: usa la función de subtítulos automáticos de
   CapCut y corrígelos a mano (el reconocimiento de voz en español
   chileno no siempre acierta). Para el hook (primeros 3 segundos),
   agrega el texto del hook como texto grande en pantalla, no solo como
   subtítulo — necesita leerse sin sonido, porque mucha gente ve el feed
   sin audio.
4. **Música**: opcional. Si la agregas, que no tape la voz, y evita
   música con copyright si vas a subir el video directo como anuncio en
   Meta (usa la librería de audio libre de CapCut o de Meta Ads Manager).
5. Exporta en la resolución más alta disponible, formato vertical.

## Imágenes estáticas en Canva

Usa las specs generadas por el creative-kit (sección "Specs de imágenes
para Canva" del archivo de output) como checklist de formato: tamaños
exactos (1080x1080 y 1080x1350), zonas seguras de texto, y qué elementos
no pueden faltar (precio, "pago contra entrega", producto real y
reconocible).

Pasos rápidos:

1. Crea un diseño nuevo en Canva con el tamaño exacto (busca plantillas de
   "Instagram Post" para 1:1 o "Instagram Story"/"Reel cover" para 4:5, y
   ajusta el tamaño si no calza exacto).
2. Sube una foto real del producto (no un stock genérico) — si no tienes
   fotos propias todavía, pide fotos reales al proveedor Dropi antes de
   usar solo imágenes de catálogo genéricas.
3. Titular grande arriba o al centro (usa uno de los titulares de ángulos
   del creative-kit).
4. Precio y "Pago contra entrega" siempre visibles.
5. Exporta en PNG o JPG de alta calidad.

## Cuántos creativos preparar para partir

3-4 anuncios distintos en el mismo ad set (ver Guía 02), idealmente
cubriendo **ángulos distintos** entre sí (no 4 variaciones del mismo
ángulo) — así aprendes qué ángulo conecta más rápido, no solo qué video
específico.

## Siguiente paso

Con creativos listos y la campaña corriendo según la Guía 02, usa
[`06-checklist-lanzamiento.md`](./06-checklist-lanzamiento.md) como
verificación final antes de gastar el primer peso.
