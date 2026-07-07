/**
 * Landing COD — manejo del formulario.
 *
 * Este archivo es JS plano (no TypeScript compilado) a propósito: Shopify
 * sirve los archivos de `assets/` tal cual, sin paso de build. El resto del
 * monorepo (calc-margen, creative-kit, storefront/server) sí es TypeScript
 * estricto — este archivo es la única excepción, por vivir dentro del tema.
 *
 * Flujo:
 *   1. Al cargar la página, genera/lee un eventId único y datos de tracking
 *      (fbp/fbc de Meta, client_id de GA4) y los deja en campos ocultos.
 *   2. Al enviar el formulario, hace POST a storefront/server con esos
 *      datos + los datos del formulario.
 *   3. Si el servidor confirma que creó la orden, dispara el evento
 *      "Purchase" (Meta Pixel) y "purchase" (GA4) del lado del navegador,
 *      usando el MISMO eventId que ya recibió el servidor — así Meta puede
 *      deduplicar el evento de navegador con el evento de la Conversions
 *      API server-side y no cuenta la conversión dos veces.
 *
 * IMPORTANTE (principio COD): este evento de "Purchase" representa un
 * PEDIDO CREADO (COD), no un pedido entregado y cobrado. Se usa el evento
 * estándar "Purchase" porque es el que mejor optimiza en Meta Ads, pero la
 * rentabilidad real solo se confirma con los pedidos que Dropi marca como
 * entregados (ver docs/calculadora-margen.md).
 */

(function () {
  "use strict";

  function leerCookie(nombre) {
    var match = document.cookie.match(
      new RegExp("(?:^|; )" + nombre + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : "";
  }

  function obtenerGa4ClientId() {
    var gaCookie = leerCookie("_ga");
    // Formato típico: GA1.2.XXXXXXXXXX.YYYYYYYYYY -> client_id = XXXXXXXXXX.YYYYYYYYYY
    if (gaCookie) {
      var partes = gaCookie.split(".");
      if (partes.length >= 4) {
        return partes[2] + "." + partes[3];
      }
    }
    var almacenado = window.localStorage.getItem("cod_ga4_client_id");
    if (almacenado) return almacenado;
    var nuevo = crypto.randomUUID();
    window.localStorage.setItem("cod_ga4_client_id", nuevo);
    return nuevo;
  }

  function mostrarEstado(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.setAttribute("data-tipo", tipo);
  }

  // Feedback visual de que el clic "surtió efecto" (ver cod-landing.css,
  // clases .cod-anim-pulso y .cod-anim-resalte).
  function animarPulso(elemento) {
    elemento.classList.remove("cod-anim-pulso");
    void elemento.offsetWidth; // fuerza reflow para poder reiniciar la animación en clics seguidos
    elemento.classList.add("cod-anim-pulso");
  }

  function resaltarSeccion(elemento, retrasoMs) {
    setTimeout(function () {
      elemento.classList.add("cod-anim-resalte");
      setTimeout(function () {
        elemento.classList.remove("cod-anim-resalte");
      }, 1300);
    }, retrasoMs || 0);
  }

  function inicializarBotonHero() {
    var botonHero = document.querySelector(".cod-hero__cta");
    if (!botonHero) return;
    var seccionForm = document.getElementById("cod-form");
    var yaDisparado = false;

    botonHero.addEventListener("click", function (evento) {
      animarPulso(botonHero);

      if (seccionForm) {
        evento.preventDefault();
        seccionForm.scrollIntoView({ behavior: "smooth", block: "start" });
        resaltarSeccion(seccionForm, 450);
      }

      // Señal de "empezó a comprar": util para leer el embudo (ver
      // playbook/03-lectura-de-metricas.md) ya que este flujo no usa el
      // carrito nativo de Shopify y por lo tanto no hay evento AddToCart.
      // Solo del lado del navegador (no crítico, no se respalda server-side).
      if (yaDisparado) return;
      yaDisparado = true;
      if (window.fbq) window.fbq("track", "InitiateCheckout");
      if (window.gtag) window.gtag("event", "begin_checkout");
    });
  }

  function inicializarFormulario(form) {
    var boton = form.querySelector(".cod-form__boton");
    var estado = form.querySelector("#cod-form-estado");
    var endpoint = boton.getAttribute("data-endpoint");

    var eventId = crypto.randomUUID();
    form.querySelector('[name="eventId"]').value = eventId;
    form.querySelector('[name="fbp"]').value = leerCookie("_fbp");
    form.querySelector('[name="fbc"]').value = leerCookie("_fbc");
    form.querySelector('[name="ga4ClientId"]').value = obtenerGa4ClientId();
    form.querySelector('[name="urlPagina"]').value = window.location.href;

    form.addEventListener("submit", function (evento) {
      evento.preventDefault();

      if (!form.reportValidity()) return;

      animarPulso(boton);

      if (!endpoint) {
        mostrarEstado(
          estado,
          "Falta configurar la URL del servidor de pedidos en el editor del tema (sección Landing COD).",
          "error"
        );
        return;
      }

      var datosFormulario = new FormData(form);
      var payload = {};
      datosFormulario.forEach(function (valor, llave) {
        payload[llave] = valor;
      });

      boton.disabled = true;
      mostrarEstado(estado, "Enviando tu pedido...", "");

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (respuesta) {
          return respuesta.json().then(function (cuerpo) {
            if (!respuesta.ok) {
              throw new Error(cuerpo.error || "No se pudo procesar el pedido.");
            }
            return cuerpo;
          });
        })
        .then(function () {
          var precio = Number(payload.precio) || 0;
          var moneda = "CLP";

          if (window.fbq) {
            window.fbq(
              "track",
              "Purchase",
              {
                value: precio,
                currency: moneda,
                content_ids: [payload.varianteId],
                content_type: "product",
                content_name: payload.productoNombre,
              },
              { eventID: eventId }
            );
          }

          if (window.gtag) {
            window.gtag("event", "purchase", {
              transaction_id: eventId,
              value: precio,
              currency: moneda,
              items: [
                {
                  item_id: payload.varianteId,
                  item_name: payload.productoNombre,
                  price: precio,
                  quantity: 1,
                },
              ],
            });
          }

          Array.prototype.forEach.call(form.elements, function (el) {
            el.disabled = true;
          });
          mostrarEstado(
            estado,
            "¡Listo! Tomamos tu pedido. Te vamos a contactar para confirmar la entrega, y pagas cuando te llega a la puerta de tu casa.",
            "ok"
          );
        })
        .catch(function (error) {
          mostrarEstado(
            estado,
            error.message || "Hubo un problema al enviar tu pedido. Intenta de nuevo.",
            "error"
          );
          boton.disabled = false;
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    inicializarBotonHero();
    var form = document.getElementById("cod-form");
    if (form) inicializarFormulario(form);
  });
})();
