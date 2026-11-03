/* ==========================================================================
   Cuidando tu salud - Animaciones e interacciones
   Cada bloque es independiente: si la página no tiene ese elemento, no hace nada.
   Índice:
   1. Preferencias y utilidades
   2. Animaciones con GSAP (entrada, scroll, contadores, parallax)
   3. Microinteracciones (ondas en botones, inclinación de tarjetas)
   4. Cinta de texto
   5. Filtros (productos y galería)
   6. Galería con visor
   7. Carrusel de testimonios
   8. Formulario de contacto
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- 1. PREFERENCIAS Y UTILIDADES ---------- */
  /* Las animaciones siempre están activas, salvo que la persona las pause con el botón de la página */
  const pausado = Boolean(window.ANIMACIONES && window.ANIMACIONES.pausadas);
  const conPunteroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hayGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const SITIO = window.SITIO;

  const $ = (selector, raiz = document) => raiz.querySelector(selector);
  const $$ = (selector, raiz = document) => Array.from(raiz.querySelectorAll(selector));


  /* ---------- 2. ANIMACIONES CON GSAP ---------- */

  /* Separa un título en palabras para que entren una por una */
  function dividirPalabras(elemento) {
    const recorrer = (nodo, degradado) => {
      Array.from(nodo.childNodes).forEach((hijo) => {
        if (hijo.nodeType === Node.TEXT_NODE) {
          const fragmento = document.createDocumentFragment();
          hijo.textContent.split(/(\s+)/).forEach((trozo) => {
            if (!trozo) return;
            if (/^\s+$/.test(trozo)) {
              fragmento.appendChild(document.createTextNode(" "));
              return;
            }
            const caja = document.createElement("span");
            caja.className = "palabra";
            const interior = document.createElement("span");
            interior.className = "palabra__in" + (degradado ? " texto-degradado" : "");
            interior.textContent = trozo;
            caja.appendChild(interior);
            fragmento.appendChild(caja);
          });
          nodo.replaceChild(fragmento, hijo);
        } else if (hijo.nodeType === Node.ELEMENT_NODE) {
          recorrer(hijo, degradado || hijo.classList.contains("texto-degradado"));
        }
      });
    };
    elemento.setAttribute("aria-label", elemento.textContent.trim());
    recorrer(elemento, false);
    return $$(".palabra__in", elemento);
  }

  function iniciarAnimaciones() {
    gsap.registerPlugin(ScrollTrigger);

    /* Entrada de la portada */
    const titulo = $("[data-palabras]");
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (titulo) {
      const palabras = dividirPalabras(titulo);
      intro.from(palabras, { yPercent: 110, rotate: 4, duration: 0.9, stagger: 0.07 }, 0.1);
    }
    if ($$("[data-intro]").length) {
      intro.from("[data-intro]", { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, clearProps: "transform,opacity" }, 0.35);
    }
    if ($("[data-intro-arte]")) {
      intro.from("[data-intro-arte]", { opacity: 0, scale: 0.85, rotate: -5, duration: 1.1, ease: "back.out(1.5)", clearProps: "transform,opacity" }, 0.3);
    }
    if ($$(".flotante").length) {
      intro.from(".flotante", { opacity: 0, scale: 0.5, duration: 0.6, stagger: 0.15, ease: "back.out(2.2)", clearProps: "transform,opacity" }, 1);
    }

    /* Aparición al hacer scroll: un elemento */
    $$("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.85, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* Aparición al hacer scroll: los hijos de un grupo, uno tras otro */
    $$("[data-reveal-grupo]").forEach((grupo) => {
      gsap.from(grupo.children, {
        opacity: 0, y: 40, duration: 0.75, stagger: 0.1, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: grupo, start: "top 86%", once: true }
      });
    });

    /* Parallax suave: [data-parallax="-30"] se desplaza ese porcentaje */
    $$("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        yPercent: Number(el.dataset.parallax),
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });

    /* Formas decorativas que flotan solas */
    $$("[data-flota]").forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 ? -18 : 18,
        x: i % 3 ? 10 : -10,
        duration: 3 + (i % 4) * 0.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });

    /* Cifras que cuentan desde cero */
    $$("[data-contador]").forEach((el) => {
      const meta = Number(el.dataset.contador);
      const decimales = Number(el.dataset.decimales || 0);
      const formato = (n) => n.toLocaleString("es", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
      const estado = { valor: 0 };
      el.textContent = formato(0);
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: () => gsap.to(estado, {
          valor: meta, duration: 1.8, ease: "power2.out",
          onUpdate: () => { el.textContent = formato(estado.valor); }
        })
      });
    });
  }


  /* ---------- 3. MICROINTERACCIONES ---------- */

  /* Onda al pulsar un botón */
  function iniciarOndas() {
    if (pausado) return;
    document.addEventListener("pointerdown", (e) => {
      const boton = e.target.closest(".boton");
      if (!boton) return;
      const caja = boton.getBoundingClientRect();
      const onda = document.createElement("span");
      onda.className = "onda";
      onda.style.left = `${e.clientX - caja.left}px`;
      onda.style.top = `${e.clientY - caja.top}px`;
      boton.appendChild(onda);
      onda.addEventListener("animationend", () => onda.remove());
    });
  }

  /* Las tarjetas con [data-tilt] se inclinan hacia el cursor */
  function iniciarInclinacion() {
    if (pausado || !conPunteroFino) return;
    $$("[data-tilt]").forEach((tarjeta) => {
      tarjeta.addEventListener("pointermove", (e) => {
        const caja = tarjeta.getBoundingClientRect();
        const x = (e.clientX - caja.left) / caja.width - 0.5;
        const y = (e.clientY - caja.top) / caja.height - 0.5;
        tarjeta.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
        tarjeta.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
      });
      tarjeta.addEventListener("pointerleave", () => {
        tarjeta.style.setProperty("--rx", "0deg");
        tarjeta.style.setProperty("--ry", "0deg");
      });
    });
  }


  /* Brillo que sigue al cursor dentro de las tarjetas */
  function iniciarLuz() {
    if (pausado || !conPunteroFino) return;
    $$(".beneficio, .cifra, .servicio-item, .bento__item, .consulta__item, .info-tarjeta, .profesional, .opinion").forEach((tarjeta) => {
      tarjeta.classList.add("tiene-luz");
      tarjeta.insertAdjacentHTML("beforeend", '<span class="luz" aria-hidden="true"></span>');
      tarjeta.addEventListener("pointermove", (e) => {
        const caja = tarjeta.getBoundingClientRect();
        tarjeta.style.setProperty("--mx", `${e.clientX - caja.left}px`);
        tarjeta.style.setProperty("--my", `${e.clientY - caja.top}px`);
      });
    });
  }

  /* Los botones se acercan un poco al cursor */
  function iniciarMagnetico() {
    if (pausado || !conPunteroFino) return;
    document.addEventListener("pointermove", (e) => {
      const boton = e.target.closest && e.target.closest(".boton:not(.boton--chico)");
      if (!boton) return;
      const caja = boton.getBoundingClientRect();
      boton.style.setProperty("--tx", `${((e.clientX - caja.left) / caja.width - 0.5) * 10}px`);
      boton.style.setProperty("--ty", `${((e.clientY - caja.top) / caja.height - 0.5) * 8}px`);
    });
    document.addEventListener("pointerout", (e) => {
      const boton = e.target.closest && e.target.closest(".boton");
      if (!boton) return;
      boton.style.setProperty("--tx", "0px");
      boton.style.setProperty("--ty", "0px");
    });
  }

  /* Barra de progreso de lectura arriba de la página */
  function iniciarProgreso() {
    if (pausado) return;
    const barra = document.createElement("div");
    barra.className = "progreso";
    barra.setAttribute("aria-hidden", "true");
    document.body.appendChild(barra);
    const actualizar = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.setProperty("--p", total > 0 ? Math.min(1, window.scrollY / total).toFixed(4) : 0);
    };
    window.addEventListener("scroll", actualizar, { passive: true });
    actualizar();
  }


  /* Dibujo decorativo de la llamada final (logo con anillos y etiquetas) */
  function iniciarLlamadaFinal() {
    $$(".cta-final").forEach((cta) => {
      const arte = document.createElement("div");
      arte.className = "cta-final__arte";
      arte.setAttribute("aria-hidden", "true");
      arte.innerHTML = `
        <span class="cta-final__anillo cta-final__anillo--2"></span>
        <span class="cta-final__anillo cta-final__anillo--1"></span>
        <span class="cta-final__logo"><img src="assets/images/logo.png" alt=""></span>
        <span class="cta-final__etiqueta cta-final__etiqueta--1">${window.iconoSitio("reloj")} Respuesta rápida</span>
        <span class="cta-final__etiqueta cta-final__etiqueta--2">${window.iconoSitio("corazon")} Trato cercano</span>
        <span class="cta-final__etiqueta cta-final__etiqueta--3">${window.iconoSitio("escudo")} Atención profesional</span>`;
      cta.appendChild(arte);
    });
  }


  /* ---------- 4. CINTA DE TEXTO ---------- */
  function iniciarCintas() {
    $$("[data-cinta]").forEach((cinta) => {
      const pista = $(".cinta__pista", cinta);
      if (!pista) return;
      Array.from(pista.children).forEach((item) => {
        const copia = item.cloneNode(true);
        copia.setAttribute("aria-hidden", "true");
        pista.appendChild(copia);
      });
    });
  }


  /* ---------- 5. FILTROS (productos y galería) ---------- */
  function iniciarFiltros() {
    $$("[data-filtros]").forEach((grupo) => {
      const destino = document.getElementById(grupo.dataset.filtros);
      const aviso = grupo.dataset.aviso ? document.getElementById(grupo.dataset.aviso) : null;
      if (!destino) return;
      const elementos = Array.from(destino.children);
      const claseEntrada = destino.dataset.entrada || "producto--entra";

      grupo.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-filtro]");
        if (!chip) return;

        $$("[data-filtro]", grupo).forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        const categoria = chip.dataset.filtro;
        let visibles = 0;

        elementos.forEach((el) => {
          const coincide = categoria === "todos" || el.dataset.categoria === categoria;
          el.hidden = !coincide;
          el.classList.remove(claseEntrada);
          if (coincide) {
            el.style.animationDelay = `${visibles * 60}ms`;
            void el.offsetWidth;
            if (!pausado) el.classList.add(claseEntrada);
            visibles += 1;
          }
        });

        if (aviso) aviso.textContent = `Mostrando ${visibles} ${visibles === 1 ? "elemento" : "elementos"}.`;
      });
    });
  }


  /* ---------- 6. GALERÍA CON VISOR ---------- */
  function iniciarGaleria() {
    const galeria = $("[data-galeria]");
    const visor = document.getElementById("visor");
    if (!galeria || !visor || typeof visor.showModal !== "function") return;

    const imagen = $("img", visor);
    const leyenda = $("figcaption", visor);
    let lista = [];
    let indice = 0;

    const mostrar = (n) => {
      indice = (n + lista.length) % lista.length;
      const foto = lista[indice];
      imagen.src = foto.dataset.src;
      imagen.alt = foto.dataset.alt || "";
      leyenda.textContent = foto.dataset.titulo || "";
    };

    galeria.addEventListener("click", (e) => {
      const foto = e.target.closest(".foto");
      if (!foto) return;
      lista = $$(".foto", galeria).filter((f) => !f.hidden);
      mostrar(lista.indexOf(foto));
      visor.showModal();
    });

    $(".visor__cerrar", visor).addEventListener("click", () => visor.close());
    $(".visor__ant", visor).addEventListener("click", () => mostrar(indice - 1));
    $(".visor__sig", visor).addEventListener("click", () => mostrar(indice + 1));
    visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
    visor.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") mostrar(indice - 1);
      if (e.key === "ArrowRight") mostrar(indice + 1);
    });
  }


  /* ---------- 7. CARRUSEL DE TESTIMONIOS ---------- */
  function iniciarCarrusel() {
    const carrusel = $("[data-carrusel]");
    if (!carrusel) return;

    const ventana = $(".carrusel__ventana", carrusel);
    const pista = $(".carrusel__pista", carrusel);
    const slides = Array.from(pista.children);
    const contenedorPuntos = $(".carrusel__puntos", carrusel);
    const botonPausa = $("[data-carrusel-pausa]", carrusel);
    const INTERVALO = 6500;

    let actual = 0;
    let temporizador = null;
    let pausaPorUsuario = pausado;

    const puntos = slides.map((_, n) => {
      const punto = document.createElement("button");
      punto.type = "button";
      punto.className = "carrusel__punto";
      punto.setAttribute("aria-label", `Ver testimonio ${n + 1} de ${slides.length}`);
      punto.addEventListener("click", () => { ir(n); reiniciar(); });
      contenedorPuntos.appendChild(punto);
      return punto;
    });

    function ir(n) {
      actual = (n + slides.length) % slides.length;
      pista.style.transform = `translateX(-${actual * 100}%)`;
      slides.forEach((slide, i) => {
        slide.classList.toggle("activa", i === actual);
        slide.toggleAttribute("inert", i !== actual);
        slide.setAttribute("aria-hidden", String(i !== actual));
      });
      puntos.forEach((punto, i) => punto.setAttribute("aria-current", String(i === actual)));
    }

    function detener() {
      clearInterval(temporizador);
      temporizador = null;
      ventana.setAttribute("aria-live", "polite");
    }

    function iniciar() {
      if (pausaPorUsuario || temporizador) return;
      ventana.setAttribute("aria-live", "off");
      temporizador = setInterval(() => ir(actual + 1), INTERVALO);
    }

    function reiniciar() { detener(); iniciar(); }

    $("[data-carrusel-ant]", carrusel).addEventListener("click", () => { ir(actual - 1); reiniciar(); });
    $("[data-carrusel-sig]", carrusel).addEventListener("click", () => { ir(actual + 1); reiniciar(); });

    if (botonPausa) {
      const textoPausa = () => {
        botonPausa.setAttribute("aria-pressed", String(pausaPorUsuario));
        botonPausa.textContent = pausaPorUsuario ? "Reanudar" : "Pausar";
      };
      textoPausa();
      botonPausa.addEventListener("click", () => {
        pausaPorUsuario = !pausaPorUsuario;
        textoPausa();
        pausaPorUsuario ? detener() : iniciar();
      });
    }

    carrusel.addEventListener("mouseenter", detener);
    carrusel.addEventListener("mouseleave", iniciar);
    carrusel.addEventListener("focusin", detener);
    carrusel.addEventListener("focusout", iniciar);
    carrusel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { ir(actual - 1); reiniciar(); }
      if (e.key === "ArrowRight") { ir(actual + 1); reiniciar(); }
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? detener() : iniciar()));

    /* Deslizar con el dedo */
    let inicioX = null;
    ventana.addEventListener("pointerdown", (e) => { inicioX = e.clientX; });
    ventana.addEventListener("pointerup", (e) => {
      if (inicioX === null) return;
      const distancia = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(distancia) > 50) { ir(actual + (distancia < 0 ? 1 : -1)); reiniciar(); }
    });

    ir(0);
    iniciar();
  }


  /* ---------- 8. FORMULARIO DE CONTACTO ----------
     No hay servidor: el mensaje se envía abriendo WhatsApp con el texto escrito. */
  function iniciarFormulario() {
    const formulario = $("[data-formulario]");
    if (!formulario) return;

    const aviso = $(".formulario__aviso", formulario);

    const reglas = {
      nombre: (v) => (v.trim().length >= 2 ? "" : "Escribe tu nombre."),
      telefono: (v) => (v.replace(/\D/g, "").length >= 7 ? "" : "Escribe un teléfono de al menos 7 números."),
      servicio: (v) => (v ? "" : "Elige un servicio.")
    };

    const marcar = (campo, mensaje) => {
      const contenedor = campo.closest(".campo");
      contenedor.classList.toggle("campo--error", Boolean(mensaje));
      $(".campo__error", contenedor).textContent = mensaje;
      campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
    };

    Object.keys(reglas).forEach((nombre) => {
      const campo = formulario.elements[nombre];
      campo.addEventListener("blur", () => marcar(campo, reglas[nombre](campo.value)));
      campo.addEventListener("input", () => { if (campo.closest(".campo--error")) marcar(campo, reglas[nombre](campo.value)); });
    });

    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
      let primerError = null;

      Object.keys(reglas).forEach((nombre) => {
        const campo = formulario.elements[nombre];
        const mensaje = reglas[nombre](campo.value);
        marcar(campo, mensaje);
        if (mensaje && !primerError) primerError = campo;
      });

      if (primerError) { primerError.focus(); return; }

      const { nombre, telefono, servicio, mensaje } = formulario.elements;
      const texto = [
        `Hola, soy ${nombre.value.trim()}.`,
        `Quiero consultar por: ${servicio.value}.`,
        mensaje.value.trim() ? mensaje.value.trim() : "",
        `Mi teléfono es ${telefono.value.trim()}.`
      ].filter(Boolean).join(" ");

      const enlace = SITIO.enlaceWhatsApp(texto);
      window.open(enlace, "_blank", "noopener");

      aviso.innerHTML = `Abrimos WhatsApp con tu mensaje. Si no se abrió, <a href="${enlace}" target="_blank" rel="noopener">pulsa aquí</a>.`;
      aviso.classList.add("visible");
      formulario.reset();
    });
  }


  /* ---------- INICIO ---------- */
  iniciarCintas();
  iniciarLlamadaFinal();
  iniciarOndas();
  iniciarInclinacion();
  iniciarLuz();
  iniciarMagnetico();
  iniciarProgreso();
  iniciarFiltros();
  iniciarGaleria();
  iniciarCarrusel();
  iniciarFormulario();

  if (hayGsap && !pausado) iniciarAnimaciones();
})();
