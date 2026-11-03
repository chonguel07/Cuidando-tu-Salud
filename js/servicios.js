/* ==========================================================================
   Cuidando tu salud - Tratamientos y paquetes (página Servicios)
   Lee js/servicios-datos.js y dibuja los filtros, las tarjetas y los paquetes.
   ========================================================================== */
(function () {
  "use strict";

  const DATOS = window.SERVICIOS;
  const SITIO = window.SITIO;
  const rejilla = document.getElementById("tratamientos");
  if (!DATOS || !rejilla) return;

  const pausado = Boolean(window.ANIMACIONES && window.ANIMACIONES.pausadas);
  const icono = (id) => window.iconoSitio(id);
  const dinero = (n) => `${DATOS.moneda} ${n.toLocaleString("es-PE")}`;
  const nombreArea = (id) => (DATOS.areas.find((a) => a.id === id) || {}).nombre || "";
  const wa = (texto) => SITIO.enlaceWhatsApp(texto);

  let area = "todas";

  /* ---------- Aparición escalonada cuando la tarjeta entra en pantalla ---------- */
  const observador = "IntersectionObserver" in window
    ? new IntersectionObserver((entradas) => {
        entradas.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("visible");
          observador.unobserve(en.target);
        });
      }, { threshold: 0.12 })
    : null;

  function animarEntrada(contenedor) {
    Array.from(contenedor.children).forEach((el, i) => {
      el.style.setProperty("--retraso", `${(i % 6) * 70}ms`);
      if (pausado || !observador) el.classList.add("visible"); else observador.observe(el);
    });
  }

  /* ---------- Filtros ---------- */
  const filtros = document.getElementById("filtros-tratamientos");
  const contador = document.getElementById("contador-tratamientos");

  function pintarFiltros() {
    const cuenta = (id) => DATOS.tratamientos.filter((t) => id === "todas" || t.area === id).length;
    const lista = [{ id: "todas", nombre: "Todos" }].concat(DATOS.areas);
    filtros.innerHTML = lista.map((a) =>
      `<button class="chip" type="button" data-area="${a.id}" aria-pressed="${a.id === area}">${a.nombre} <small>${cuenta(a.id)}</small></button>`
    ).join("");
  }

  filtros.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-area]");
    if (!boton) return;
    area = boton.dataset.area;
    pintarFiltros();
    pintarTratamientos();
  });

  /* ---------- Tarjetas de tratamiento ---------- */
  function tarjeta(t) {
    const mensaje = `Hola, quiero reservar: ${t.nombre}. ¿Me indican horarios y el precio según mi caso?`;
    return `
      <article class="tratamiento" data-area="${t.area}">
        <div class="tratamiento__imagen">
          <img src="${t.imagen}" alt="Ilustración de ${t.nombre.toLowerCase()}" width="240" height="180" loading="lazy">
          <span class="tratamiento__area">${nombreArea(t.area)}</span>
        </div>
        <div class="tratamiento__cuerpo">
          <h3>${t.nombre}</h3>
          <p>${t.descripcion}</p>
          <span class="servicio-item__ideal">${t.ideal}</span>
          <div class="tratamiento__pie">
            <div class="tratamiento__precio">
              <small>Desde</small>
              <strong>${dinero(t.desde)}</strong>
              <span>${icono("reloj")} ${t.duracion}</span>
            </div>
            <a class="boton boton--chico boton--whatsapp" href="${wa(mensaje)}" target="_blank" rel="noopener">${icono("whatsapp")} Reservar</a>
          </div>
        </div>
      </article>`;
  }

  function pintarTratamientos() {
    const lista = DATOS.tratamientos.filter((t) => area === "todas" || t.area === area);
    rejilla.innerHTML = lista.map(tarjeta).join("");
    window.pintarIconos(rejilla);
    animarEntrada(rejilla);
    contador.textContent = `${lista.length} ${lista.length === 1 ? "tratamiento" : "tratamientos"}`;
  }

  /* ---------- Paquetes y ofertas ---------- */
  const mes = new Date();
  const finDeMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
  const textoVigencia = `Hasta el ${finDeMes.getDate()} de ${finDeMes.toLocaleDateString("es", { month: "long" })}`;
  const vigencia = document.getElementById("vigencia-ofertas");
  if (vigencia) vigencia.textContent = textoVigencia;

  function paquete(p) {
    const ahorro = Math.round((1 - p.desde / p.antes) * 100);
    const mensaje = `Hola, me interesa el paquete "${p.nombre}". ¿Me dan más información?`;
    return `
      <article class="paquete paquete--${p.tono}">
        <span class="forma paquete__forma" aria-hidden="true"></span>
        ${p.oferta ? `<span class="badge paquete__oferta">Oferta del mes</span>` : `<span class="badge paquete__oferta paquete__oferta--simple">Paquete</span>`}
        <h3>${p.nombre}</h3>
        <ul>${p.incluye.map((i) => `<li>${icono("check")} ${i}</li>`).join("")}</ul>
        <div class="paquete__precio">
          <div><small>Desde</small><strong>${dinero(p.desde)}</strong><s>${dinero(p.antes)}</s></div>
          <em>-${ahorro}%</em>
        </div>
        ${p.oferta ? `<p class="paquete__vigencia">${icono("calendario")} ${textoVigencia}</p>` : ""}
        <a class="boton boton--chico boton--claro" href="${wa(mensaje)}" target="_blank" rel="noopener">Lo quiero ${icono("flecha")}</a>
      </article>`;
  }

  const paquetes = document.getElementById("paquetes");
  if (paquetes) {
    paquetes.innerHTML = DATOS.paquetes.map(paquete).join("");
    window.pintarIconos(paquetes);
    animarEntrada(paquetes);
  }

  pintarFiltros();
  pintarTratamientos();
})();
