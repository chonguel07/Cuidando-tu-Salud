/* ==========================================================================
   Cuidando tu salud - Componentes compartidos
   Genera lo que se repite en todas las páginas (cabecera, menú móvil, pie,
   botón de WhatsApp, botón de animaciones e íconos) para no duplicar código.
   Índice:
   1. Páginas del sitio
   2. Íconos
   3. Utilidades
   4. Plantillas (cabecera, menú, pie)
   5. Inserción en la página
   6. Menú móvil
   7. Datos del sitio en el HTML
   ========================================================================== */
(function () {
  "use strict";

  const SITIO = window.SITIO;

  /* Las animaciones están siempre activas. Solo se detienen si la persona pulsa
     el botón "Pausar animaciones" (se recuerda en su navegador). */
  let pausadas = false;
  try { pausadas = localStorage.getItem("cts-anim") === "off"; } catch (e) { /* sin almacenamiento */ }
  window.ANIMACIONES = { pausadas };
  document.documentElement.classList.toggle("sin-anim", pausadas);


  /* ---------- 1. PÁGINAS DEL SITIO ---------- */
  const PAGINAS = [
    { id: "inicio",      url: "index.html",       texto: "Inicio" },
    { id: "servicios",   url: "servicios.html",   texto: "Servicios" },
    { id: "explora",     url: "explora.html",     texto: "Explora" },
    { id: "productos",   url: "productos.html",   texto: "Productos" },
    { id: "nosotros",    url: "nosotros.html",    texto: "Nosotros" },
    { id: "galeria",     url: "galeria.html",     texto: "Galería" },
    { id: "testimonios", url: "testimonios.html", texto: "Testimonios" },
    { id: "contacto",    url: "contacto.html",    texto: "Contacto" }
  ];


  /* ---------- 2. ÍCONOS ----------
     Se dibujan una sola vez como símbolos y se usan con data-icono="nombre". */
  const ICONOS = {
    pie: '<path d="M8 3c-1.800 1-3 3.500-2.500 6.500S5 15 5 17c0 2 1.500 3 3 3s3-1 3-3c0-2-1-4 0-7s1-5.500-1.500-6.500z"/><circle cx="15" cy="6" r="1.300"/><circle cx="18" cy="9" r="1.100"/><circle cx="19.500" cy="13" r="1"/>',
    columna: '<ellipse cx="12" cy="4.500" rx="3" ry="1.500"/><ellipse cx="12.500" cy="9" rx="3.500" ry="1.600"/><ellipse cx="12" cy="13.500" rx="4" ry="1.800"/><ellipse cx="11" cy="18.500" rx="4.500" ry="2"/>',
    escudo: '<path d="M12 3l8 3v6c0 4.500-3.300 7.800-8 9-4.700-1.200-8-4.500-8-9V6z"/><path d="m8.500 12 2.500 2.500 4.500-5"/>',
    corazon: '<path d="M12 20s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.300a4.300 4.300 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    usuarios: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6"/><circle cx="17" cy="9" r="2.500"/><path d="M17 14c2.800 0 4.500 1.800 4.500 4.500"/>',
    estrella: '<path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/>',
    whatsapp: '<path d="M3 21l1.700-5A9 9 0 1 1 8 19.300z"/><path d="M9 8.500c0 3.600 2.900 6.500 6.500 6.500l1-1.600-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"/>',
    telefono: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.500"/>',
    correo: '<rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="m3 7 9 6 9-6"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    izq: '<path d="M15 5l-7 7 7 7"/>',
    der: '<path d="M9 5l7 7-7 7"/>',
    chispa: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/><path d="M19 17v4M17 19h4"/>',
    premio: '<circle cx="12" cy="9" r="6"/><path d="m8.500 14-1.500 7 5-3 5 3-1.500-7"/>',
    hoja: '<path d="M5 19C5 10 10 5 20 4c0 10-5 16-13 16"/><path d="M5 19c3-5 6-8 10-10"/>',
    check: '<path d="m5 12.500 4.500 4.500L19 7"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.500c0-.3.200-.5.500-.5z"/>',
    tiktok: '<path d="M14 3v11.500a3.500 3.500 0 1 1-3.500-3.500M14 3c.300 2.800 2.100 4.600 5 4.800"/>',
    cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
    objetivo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.200"/>',
    ojo: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    lupa: '<circle cx="11" cy="11" r="7"/><path d="m16.500 16.500 4.500 4.500"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    gota: '<path d="M12 3s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',
    expandir: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    reiniciar: '<path d="M4 12a8 8 0 1 0 2.600-5.900M4 4v5h5"/>',
    cuerpo: '<circle cx="12" cy="4.500" r="2"/><path d="M12 8v7M7 10l5-2 5 2M9 21l3-6 3 6"/>',
    bolsa: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
    camion: '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6.500" cy="17.500" r="1.800"/><circle cx="16.500" cy="17.500" r="1.800"/>',
    pausa: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 4.500v15l12-7.500z"/>',
    rayo: '<path d="M13 3 5 13.500h6L10 21l8-10.500h-6z"/>',
    mano: '<path d="M8 12V5.500a1.500 1.500 0 0 1 3 0V11M11 10V4a1.500 1.500 0 0 1 3 0v6M14 10V5.500a1.500 1.500 0 0 1 3 0V12M17 9.500a1.500 1.500 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.500a6 6 0 0 1-4.800-2.400L4 14.500a1.500 1.500 0 0 1 2.300-1.900L8 14"/>'
  };

  function insertarSprite() {
    const simbolos = Object.entries(ICONOS)
      .map(([id, trazo]) => `<symbol id="i-${id}" viewBox="0 0 24 24">${trazo}</symbol>`)
      .join("");
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${simbolos}</defs></svg>`
    );
  }

  function icono(id) {
    return `<svg class="i" aria-hidden="true" focusable="false"><use href="#i-${id}"></use></svg>`;
  }

  /* Cualquier elemento con data-icono="nombre" recibe su ícono */
  function pintarIconos(raiz = document) {
    raiz.querySelectorAll("[data-icono]").forEach((el) => {
      if (!el.firstElementChild) el.innerHTML = icono(el.dataset.icono);
    });
  }

  /* Cualquier elemento con data-estrellas="4" recibe esa cantidad de estrellas (de 5) */
  function pintarEstrellas(raiz = document) {
    raiz.querySelectorAll("[data-estrellas]").forEach((el) => {
      const cantidad = Number(el.dataset.estrellas);
      let html = "";
      for (let n = 1; n <= 5; n++) html += icono("estrella").replace('class="i"', n <= cantidad ? 'class="i"' : 'class="i vacia"');
      el.innerHTML = html;
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", `${cantidad} de 5 estrellas`);
    });
  }


  /* ---------- 3. UTILIDADES ---------- */
  function enlaceWhatsApp(mensaje) {
    return `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }
  SITIO.enlaceWhatsApp = enlaceWhatsApp;
  window.PAGINAS = PAGINAS;
  window.iconoSitio = icono;


  /* ---------- 4. PLANTILLAS ---------- */
  function plantillaCabecera(actual) {
    const enlaces = PAGINAS.map((p) =>
      `<li><a href="${p.url}"${p.id === actual ? ' aria-current="page"' : ""}>${p.texto}</a></li>`
    ).join("");

    return `
      <header class="cabecera" id="cabecera-sitio">
        <div class="contenedor cabecera__fila">
          <a class="marca" href="index.html" aria-label="${SITIO.nombre}, ir al inicio">
            <img class="marca__logo" src="assets/images/logo.png" alt="" width="42" height="42">
            <span class="marca__nombre">${SITIO.nombre}</span>
          </a>
          <nav class="nav" aria-label="Principal">
            <ul class="nav__lista">
              ${enlaces}
              <li><a class="boton boton--chico" href="${enlaceWhatsApp("Hola, quiero agendar una cita.")}" target="_blank" rel="noopener">Agendar cita</a></li>
            </ul>
          </nav>
          <button class="burger" type="button" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir menú"><span></span></button>
        </div>
      </header>`;
  }

  function plantillaMenuMovil(actual) {
    const enlaces = PAGINAS.map((p, i) =>
      `<li style="--i:${i}"><a href="${p.url}"${p.id === actual ? ' aria-current="page"' : ""}>${p.texto}</a></li>`
    ).join("");

    return `
      <div class="menu-movil" id="menu-movil" role="dialog" aria-label="Menú de navegación">
        <ul class="menu-movil__lista">${enlaces}</ul>
        <div class="menu-movil__cta">
          <a class="boton boton--whatsapp" href="${enlaceWhatsApp("Hola, quiero agendar una cita.")}" target="_blank" rel="noopener">
            ${icono("whatsapp")} Escribir por WhatsApp
          </a>
        </div>
      </div>`;
  }

  function plantillaPie() {
    const enlaces = PAGINAS.map((p) => `<li><a href="${p.url}">${p.texto}</a></li>`).join("");
    const horarios = SITIO.horarios.map(([dia, hora]) => `<li><span>${dia}</span><span>${hora}</span></li>`).join("");

    return `
      <footer class="pie seccion--ola">
        <div class="contenedor">
          <div class="pie__rejilla">
            <div>
              <a class="pie__marca" href="index.html">
                <img src="assets/images/logo.png" alt="" width="44" height="44">
                <span>${SITIO.nombre}</span>
              </a>
              <p>Policlínico de podología y quiropraxia. Cuidamos tus pies y tu espalda para que te muevas sin dolor.</p>
              <div class="pie__redes">
                <a href="${SITIO.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icono("facebook")}</a>
                <a href="${SITIO.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${icono("tiktok")}</a>
                <a href="${enlaceWhatsApp("Hola, quiero información.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${icono("whatsapp")}</a>
              </div>
            </div>
            <nav aria-label="Páginas del sitio">
              <h3>Páginas</h3>
              <ul class="pie__lista">${enlaces}</ul>
            </nav>
            <div>
              <h3>Horario</h3>
              <ul class="pie__lista pie__lista--horario">${horarios}</ul>
            </div>
            <div>
              <h3>Contacto</h3>
              <ul class="pie__lista">
                <li>${SITIO.direccion}</li>
                <li><a href="tel:${SITIO.telefono.replace(/\s/g, "")}">${SITIO.telefono}</a></li>
               ${/* <li><a href="mailto:${SITIO.correo}">${SITIO.correo}</a></li> */ ""}
              </ul>
            </div>
          </div>
          <div class="pie__copy">
            <p>&copy; ${new Date().getFullYear()} ${SITIO.nombre}. Todos los derechos reservados.</p>
            <p>Podología y quiropraxia.</p>
          </div>
        </div>
      </footer>
      <a class="wa-flotante" href="${enlaceWhatsApp("Hola, quiero información.")}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${icono("whatsapp")}</a>
      <button class="anim-boton" type="button" aria-pressed="${pausadas}" aria-label="${pausadas ? "Activar animaciones" : "Pausar animaciones"}">
        ${icono(pausadas ? "play" : "pausa")}<span>${pausadas ? "Activar animaciones" : "Pausar animaciones"}</span>
      </button>`;
  }


  /* Franja "Envíos con Shalom". Se coloca con <div data-envios></div> en cualquier página.
     Los textos de alcance y tiempo se cambian en js/config.js (envios). */
  function plantillaEnvios(variante) {
    const e = SITIO.envios || {};
    const mensaje = enlaceWhatsApp("Hola, quiero consultar por un envío a provincia con Shalom.");
    return `
      <div class="envios${variante === "contacto" ? " envios--contacto" : ""}" data-reveal>
        <span class="envios__camino" aria-hidden="true"></span>
        <div class="envios__texto">
          <span class="envios__etiqueta">${icono("camion")} Envíos a provincia</span>
          <h2>Enviamos a <strong>${e.alcance || "todo el Perú"}</strong> con <span class="shalom-marca">${(e.empresa || "Shalom").toUpperCase()}</span></h2>
          <p>Haz tu pedido, paga y recoge tu paquete en la agencia ${e.empresa || "Shalom"} más cercana a tu casa. El envío ya está incluido en el precio.</p>
          <ul class="envios__datos">
            <li>${icono("pin")} Envíos a ${e.alcance || "todo el Perú"}</li>
            <li>${icono("check")} Envío incluido en el precio</li>
            <li>${icono("reloj")} ${e.tiempo || "Llega en pocos días"}</li>
          </ul>
          <ol class="envios__pasos">
            <li><span>1</span><div><strong>Haces tu pedido</strong><small>Elige tus productos y envíalo por WhatsApp.</small></div></li>
            <li><span>2</span><div><strong>Pagas por adelantado</strong><small>Te confirmamos y coordinamos el pago.</small></div></li>
            <li><span>3</span><div><strong>Lo enviamos</strong><small>Sale por ${e.empresa || "Shalom"} a tu ciudad.</small></div></li>
            <li><span>4</span><div><strong>Lo recoges</strong><small>En la agencia ${e.empresa || "Shalom"} más cercana, a tu nombre.</small></div></li>
          </ol>
          <div class="grupo-botones">
            <a class="boton boton--claro" href="productos.html">Ver productos ${icono("flecha")}</a>
            <a class="boton boton--borde-claro" href="${mensaje}" target="_blank" rel="noopener">${icono("whatsapp")} Consultar mi envío</a>
          </div>
        </div>
        <div class="envios__arte">
          <img src="${e.imagen || "assets/images/envios/shalom.jpg"}" alt="Camiones y furgoneta rojos de ${e.empresa || "Shalom"}" width="1100" height="619" loading="lazy">
          <span class="envios__sello">${icono("camion")}<b>${e.tiempo || "Llega en pocos días"}</b></span>
        </div>
      </div>`;
  }


  /* ---------- 5. INSERCIÓN EN LA PÁGINA ---------- */
  function insertarComponentes() {
    const actual = document.body.dataset.pagina;
    insertarSprite();

    const cabecera = document.getElementById("cabecera");
    if (cabecera) cabecera.outerHTML = plantillaCabecera(actual) + plantillaMenuMovil(actual);

    const pie = document.getElementById("pie");
    if (pie) pie.outerHTML = plantillaPie();

    document.querySelectorAll("[data-envios]").forEach((el) => {
      el.outerHTML = plantillaEnvios(el.dataset.envios);
    });

    pintarIconos();
    pintarEstrellas();
  }


  /* ---------- 6. MENÚ MÓVIL ---------- */
  function iniciarMenu() {
    const boton = document.querySelector(".burger");
    const menu = document.getElementById("menu-movil");
    const cabecera = document.getElementById("cabecera-sitio");
    if (!boton || !menu) return;

    const alternar = (abrir) => {
      menu.classList.toggle("abierto", abrir);
      boton.setAttribute("aria-expanded", String(abrir));
      boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = abrir ? "hidden" : "";
    };

    boton.addEventListener("click", () => alternar(boton.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) alternar(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") alternar(false); });
    window.matchMedia("(min-width: 72rem)").addEventListener("change", (e) => { if (e.matches) alternar(false); });

    // Sombra de la cabecera al hacer scroll
    const marcarScroll = () => cabecera.classList.toggle("cabecera--scroll", window.scrollY > 10);
    window.addEventListener("scroll", marcarScroll, { passive: true });
    marcarScroll();
  }


  /* ---------- 6b. BOTÓN PAUSAR / ACTIVAR ANIMACIONES ----------
     Se recarga la página para que todo vuelva a empezar limpio. */
  function iniciarBotonAnimaciones() {
    const boton = document.querySelector(".anim-boton");
    if (!boton) return;
    boton.addEventListener("click", () => {
      try { localStorage.setItem("cts-anim", pausadas ? "on" : "off"); } catch (e) { /* sin almacenamiento */ }
      location.reload();
    });
  }


  /* ---------- 8. DATOS DEL SITIO EN EL HTML ----------
     [data-sitio="direccion"]  -> texto
     [data-wa="Mensaje"]       -> enlace a WhatsApp con ese mensaje
     [data-tel] / [data-mail]  -> enlaces de teléfono y correo
     [data-horarios]           -> lista de horarios */
  function rellenarDatos() {
    document.querySelectorAll("[data-sitio]").forEach((el) => {
      const valor = SITIO[el.dataset.sitio];
      if (typeof valor === "string") el.textContent = valor;
    });

    document.querySelectorAll("[data-wa]").forEach((el) => {
      el.href = enlaceWhatsApp(el.dataset.wa);
      el.target = "_blank";
      el.rel = "noopener";
    });

    document.querySelectorAll("[data-tel]").forEach((el) => {
      el.href = `tel:${SITIO.telefono.replace(/\s/g, "")}`;
      el.textContent = SITIO.telefono;
    });

     document.querySelectorAll("[data-mail]").forEach((el) => {
      el.href = `mailto:${SITIO.correo}`;
      el.textContent = SITIO.correo;
    });

    document.querySelectorAll("[data-mapa-incrustado]").forEach((el) => {
      if (!SITIO.mapaIncrustado) return;
      const marco = document.createElement("iframe");
      marco.src = SITIO.mapaIncrustado;
      marco.title = `Mapa con la ubicación de ${SITIO.nombre}`;
      marco.loading = "lazy";
      marco.referrerPolicy = "strict-origin-when-cross-origin";
      marco.allowFullscreen = true;
      el.appendChild(marco);
    });

    document.querySelectorAll("[data-mapa]").forEach((el) => {
      el.href = SITIO.mapa;
      el.target = "_blank";
      el.rel = "noopener";
    });

    document.querySelectorAll("[data-horarios]").forEach((el) => {
      el.innerHTML = SITIO.horarios
        .map(([dia, hora]) => `<li class="horario-fila"><span>${dia}</span><strong>${hora}</strong></li>`)
        .join("");
    });
  }


  /* ---------- INICIO ---------- */
  insertarComponentes();
  iniciarMenu();
  iniciarBotonAnimaciones();
  rellenarDatos();
  window.pintarIconos = pintarIconos;
  window.pintarEstrellas = pintarEstrellas;
})();
