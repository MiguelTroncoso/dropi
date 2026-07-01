# 01 — Setup inicial de Facebook Ads

Antes de poder gastar un peso en publicidad necesitas dejar armada la
infraestructura de cuentas. Se hace una sola vez (no por campaña). Sigue el
orden — cada paso depende del anterior.

## 1. Business Manager (Meta Business Suite)

1. Entra a [business.facebook.com](https://business.facebook.com) con tu
   cuenta personal de Facebook (no hace falta una cuenta nueva).
2. **Crear cuenta** → nombre del negocio (puede ser tu nombre o razón
   social), tu nombre, tu email de trabajo.
3. Verifica el email cuando llegue el correo de confirmación.

Esto crea el "Business Manager" (BM): el contenedor donde van a vivir tu
página, tu cuenta publicitaria y tu Pixel.

## 2. Página de Facebook (y cuenta de Instagram)

1. Dentro del BM: **Cuentas → Páginas → Agregar → Crear una página nueva**
   (si no tienes una ya para el negocio).
2. Nombre de la página: el de tu marca/tienda, no el del producto
   individual (vas a poder vender más de un producto a futuro).
3. Categoría: "Tienda de artículos" o similar.
4. Conecta o crea una cuenta de Instagram desde **Cuentas → Cuentas de
   Instagron** dentro del mismo BM, y vincúlala a la página. No es
   obligatorio para partir, pero Instagram suele ser un canal fuerte para
   COD en Chile — mejor tenerlo listo desde el día 1.

## 3. Cuenta publicitaria

1. BM → **Cuentas → Cuentas publicitarias → Agregar → Crear una cuenta
   publicitaria nueva**.
2. Zona horaria: **America/Santiago**. Esto no se puede cambiar después
   sin crear una cuenta nueva — revísalo con calma.
3. Moneda: **CLP (peso chileno)**. Mismo problema: no se cambia después.
4. Asígnate a ti mismo como usuario con acceso total.

## 4. Método de pago

1. Dentro de la cuenta publicitaria → **Configuración de pago → Agregar
   método de pago**.
2. Chile: normalmente funciona una tarjeta de crédito o débito
   internacional (Visa/Mastercard). Si tu tarjeta es rechazada, prueba con
   otra o revisa con tu banco si bloquea cargos internacionales
   recurrentes (Meta cobra desde EE.UU.).
3. Define un **límite de gasto de la cuenta** (opcional pero recomendado
   al partir) como freno de seguridad mientras aprendes — puedes subirlo
   después.

## 5. Verificación de dominio

Verificar el dominio le confirma a Meta que el sitio (tu tienda Shopify)
es tuyo, y es un requisito para que la atribución de eventos (Pixel/CAPI)
funcione bien, sobre todo desde los cambios de iOS 14.

1. BM → **Configuración de la marca → Dominios → Agregar**.
2. Escribe tu dominio (el que apuntaste a Shopify, sin `https://` ni `www`).
3. Verifícalo por **registro DNS (TXT)** — Meta te da un valor para pegar
   en el proveedor donde compraste el dominio, o directamente desde
   Shopify si tu DNS lo administra Shopify (**Configuración → Dominios →
   [tu dominio] → DNS**, agregar el registro TXT que te dio Meta).
4. Puede tardar hasta 72 horas en verificarse, aunque normalmente es más
   rápido. Hazlo apenas tengas el dominio conectado a Shopify, no dejes
   esto para el final.

## 6. Instalar el Pixel + Conversions API

Esto ya está resuelto en código en este repo — acá solo pegas las
credenciales:

1. BM → **Orígenes de datos → Pixeles → Agregar** (si todavía no tienes
   uno). Anota el **Pixel ID**.
2. Sigue las instrucciones de
   [`storefront/server/README.md`](../storefront/server/README.md) para
   generar el **token de Conversions API** y pegar ambos valores
   (`META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`) en el `.env` del servidor.
3. En el editor de temas de Shopify, pega el mismo **Pixel ID** en el
   setting correspondiente de la sección "Landing COD" (ver
   [`storefront/README.md`](../storefront/README.md)).
4. Verifica que esté funcionando **antes** de lanzar: BM → **Orígenes de
   datos → Pixeles → (tu pixel) → Test Events**, haz un pedido de prueba en
   tu landing y confirma que aparece el evento `Purchase` — vas a ver dos
   entradas para el mismo evento (una del navegador, "Browser", y otra del
   servidor, "Server") con el mismo Event ID, marcadas como deduplicadas.
   Eso confirma que el Pixel y la Conversions API están bien conectados.

## 7. GA4 (opcional pero recomendado)

1. [analytics.google.com](https://analytics.google.com) → crea una
   propiedad GA4 para tu dominio.
2. Sigue las instrucciones de `storefront/server/README.md` para obtener
   el `GA4_MEASUREMENT_ID` y el `GA4_API_SECRET`.
3. Pega el Measurement ID también en el setting de la sección "Landing
   COD" en Shopify.

## Checklist antes de pasar a la Guía 02

- [ ] Business Manager creado y verificado.
- [ ] Página de Facebook (e idealmente Instagram) conectada al BM.
- [ ] Cuenta publicitaria creada, con zona horaria Santiago y moneda CLP.
- [ ] Método de pago agregado y funcionando.
- [ ] Dominio verificado en el BM.
- [ ] Pixel ID y token de Conversions API pegados en
      `storefront/server/.env`, servidor corriendo.
- [ ] Pixel ID pegado en el editor de temas de Shopify.
- [ ] Pedido de prueba hecho y evento `Purchase` visto en Test Events,
      deduplicado entre navegador y servidor.

Con esto listo, sigue a
[`02-campana-facebook-paso-a-paso.md`](./02-campana-facebook-paso-a-paso.md).
