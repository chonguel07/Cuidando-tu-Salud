/* ==========================================================================
   Cuidando tu salud - Tienda (página Productos)
   Lee el catálogo de js/productos-datos.js y se encarga de:
   1. Filtros, búsqueda y orden
   2. Tarjetas de producto y vista rápida
   3. Carrito ("Mi pedido") y envío por WhatsApp
   ========================================================================== */
(function () {
  "use strict";

  const TIENDA = window.TIENDA;
  const SITIO = window.SITIO;
  const rejilla = document.getElementById("productos");
  if (!TIENDA || !rejilla) return;

  const $ = (s, r = document) => r.querySelector(s);
  const icono = (id) => window.iconoSitio(id);
  const pausado = Boolean(window.ANIMACIONES && window.ANIMACIONES.pausadas);
  const dinero = (n) => `${TIENDA.moneda} ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const nota = (n) => n.toLocaleString("es", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const productoPorId = (id) => TIENDA.productos.find((p) => p.id === id);
  const nombreCategoria = (id) => (TIENDA.categorias.find((c) => c.id === id) || {}).nombre || "";
  const descuento = (p) => (p.precioAntes ? Math.round((1 - p.precio / p.precioAntes) * 100) : 0);

  const filtro = { texto: "", categoria: "todos", max: Infinity, oferta: false, stock: false, orden: "relevancia" };
  const precioTope = Math.ceil(Math.max(...TIENDA.productos.map((p) => p.precio)) / 5) * 5;
  filtro.max = precioTope;


  /* ---------- 1. FILTROS ---------- */
  const campos = {
    buscar: $("#buscar"),
    orden: $("#ordenar"),
    precio: $("#precio-max"),
    precioSalida: $("#precio-salida"),
    oferta: $("#solo-oferta"),
    stock: $("#solo-stock"),
    categorias: $("#lista-categorias"),
    contador: $("#contador"),
    limpiar: $("#limpiar"),
    vacio: $("#tienda-vacia")
  };

  function pintarCategorias() {
    const cuenta = (id) => TIENDA.productos.filter((p) => id === "todos" || p.categoria === id).length;
    const todas = [{ id: "todos", nombre: "Todos los productos" }].concat(TIENDA.categorias);
    campos.categorias.innerHTML = todas.map((c) =>
      `<li><button type="button" class="categoria-boton" data-categoria="${c.id}" aria-pressed="${c.id === filtro.categoria}">${c.nombre}<span>${cuenta(c.id)}</span></button></li>`
    ).join("");
  }

  function filtrados() {
    const texto = filtro.texto.trim().toLowerCase();
    let lista = TIENDA.productos.filter((p) =>
      (filtro.categoria === "todos" || p.categoria === filtro.categoria) &&
      p.precio <= filtro.max &&
      (!filtro.oferta || p.precioAntes) &&
      (!filtro.stock || p.stock > 0) &&
      (!texto || `${p.nombre} ${p.descripcion} ${nombreCategoria(p.categoria)}`.toLowerCase().includes(texto))
    );
    const orden = {
      "precio-menor": (a, b) => a.precio - b.precio,
      "precio-mayor": (a, b) => b.precio - a.precio,
      valoracion: (a, b) => b.valoracion - a.valoracion || b.resenas - a.resenas,
      nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es")
    }[filtro.orden];
    if (orden) lista = lista.slice().sort(orden);
    return lista;
  }

  function hayFiltros() {
    return filtro.texto || filtro.categoria !== "todos" || filtro.max < precioTope || filtro.oferta || filtro.stock;
  }

  function actualizar() {
    const lista = filtrados();
    pintarCategorias();
    pintarProductos(lista);
    campos.contador.textContent = `${lista.length} ${lista.length === 1 ? "producto" : "productos"}`;
    campos.limpiar.hidden = !hayFiltros();
    campos.vacio.hidden = lista.length > 0;
    campos.precioSalida.textContent = dinero(filtro.max);
  }

  campos.precio.max = String(precioTope);
  campos.precio.value = String(precioTope);

  campos.buscar.addEventListener("input", () => { filtro.texto = campos.buscar.value; actualizar(); });
  campos.orden.addEventListener("change", () => { filtro.orden = campos.orden.value; actualizar(); });
  campos.precio.addEventListener("input", () => { filtro.max = Number(campos.precio.value); actualizar(); });
  campos.oferta.addEventListener("change", () => { filtro.oferta = campos.oferta.checked; actualizar(); });
  campos.stock.addEventListener("change", () => { filtro.stock = campos.stock.checked; actualizar(); });
  campos.categorias.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-categoria]");
    if (!boton) return;
    filtro.categoria = boton.dataset.categoria;
    actualizar();
  });
  const limpiar = () => {
    Object.assign(filtro, { texto: "", categoria: "todos", max: precioTope, oferta: false, stock: false });
    campos.buscar.value = "";
    campos.precio.value = String(precioTope);
    campos.oferta.checked = false;
    campos.stock.checked = false;
    actualizar();
  };
  campos.limpiar.addEventListener("click", limpiar);
  $("#vaciar-filtros").addEventListener("click", limpiar);


  /* ---------- 2. TARJETAS Y VISTA RÁPIDA ---------- */
  let favoritos = new Set();
  try { favoritos = new Set(JSON.parse(localStorage.getItem("cts-favoritos") || "[]")); } catch (e) { /* sin almacenamiento */ }
  const guardarFavoritos = () => { try { localStorage.setItem("cts-favoritos", JSON.stringify([...favoritos])); } catch (e) { /* sin almacenamiento */ } };

  function precioHtml(p) {
    const antes = p.precioAntes ? `<s>${dinero(p.precioAntes)}</s><em>-${descuento(p)}%</em>` : "";
    return `<div class="precio"><strong>${dinero(p.precio)}</strong>${antes}</div>`;
  }

  function insigniasHtml(p) {
    const lista = [];
    if (p.stock === 0) lista.push('<span class="producto__insignia producto__insignia--agotado">Agotado</span>');
    else if (p.stock <= 5) lista.push(`<span class="producto__insignia producto__insignia--poco">Quedan ${p.stock}</span>`);
    if (p.insignia) lista.push(`<span class="producto__insignia">${p.insignia}</span>`);
    if (p.precioAntes) lista.push(`<span class="producto__insignia producto__insignia--oferta">Oferta</span>`);
    return `<div class="producto__insignias">${lista.join("")}</div>`;
  }

  function valoracionHtml(p) {
    return `<div class="producto__valoracion"><span class="estrellas" data-estrellas="${Math.round(p.valoracion)}"></span><span>${nota(p.valoracion)} <small>(${p.resenas})</small></span></div>`;
  }

  function tarjetaHtml(p, indice) {
    const agotado = p.stock === 0;
    const favorito = favoritos.has(p.id);
    return `
      <article class="producto${pausado ? "" : " producto--entra"}" data-categoria="${p.categoria}" data-id="${p.id}" style="animation-delay:${indice * 55}ms">
        <div class="producto__media">
          ${insigniasHtml(p)}
          <button class="favorito" type="button" data-favorito="${p.id}" aria-pressed="${favorito}" aria-label="${favorito ? "Quitar de favoritos" : "Guardar en favoritos"}: ${p.nombre}">${icono("corazon")}</button>
          <img src="${p.imagen}" alt="${p.nombre}" width="240" height="240" loading="lazy">
          <button class="vista-rapida" type="button" data-detalle="${p.id}">${icono("ojo")} Vista rápida</button>
        </div>
        <div class="producto__cuerpo">
          <span class="producto__categoria">${nombreCategoria(p.categoria)}</span>
          <h3>${p.nombre}</h3>
          ${valoracionHtml(p)}
          <p>${p.descripcion}</p>
          ${precioHtml(p)}
          <div class="producto__acciones">
            <button class="boton boton--chico" type="button" data-agregar="${p.id}" ${agotado ? "disabled" : ""}>${agotado ? "Agotado" : `Agregar ${icono("flecha")}`}</button>
            <button class="boton boton--borde boton--chico" type="button" data-detalle="${p.id}">Detalles</button>
          </div>
        </div>
      </article>`;
  }

  function pintarProductos(lista) {
    rejilla.innerHTML = lista.map(tarjetaHtml).join("");
    window.pintarIconos(rejilla);
    window.pintarEstrellas(rejilla);
  }

  rejilla.addEventListener("click", (e) => {
    const agregar = e.target.closest("[data-agregar]");
    if (agregar) return agregarAlCarrito(agregar.dataset.agregar, 1, agregar);
    const detalle = e.target.closest("[data-detalle]");
    if (detalle) return abrirDetalle(detalle.dataset.detalle);
    const fav = e.target.closest("[data-favorito]");
    if (fav) {
      const id = fav.dataset.favorito;
      if (favoritos.has(id)) favoritos.delete(id); else favoritos.add(id);
      guardarFavoritos();
      fav.setAttribute("aria-pressed", String(favoritos.has(id)));
    }
  });

  /* Vista rápida */
  const detalle = document.createElement("dialog");
  detalle.className = "ventana";
  detalle.setAttribute("aria-label", "Detalle del producto");
  document.body.appendChild(detalle);
  let detalleId = null;
  let detalleCantidad = 1;

  function pintarDetalle() {
    const p = productoPorId(detalleId);
    const agotado = p.stock === 0;
    detalle.innerHTML = `
      <button class="ventana__cerrar" type="button" data-cerrar aria-label="Cerrar">${icono("cerrar")}</button>
      <div class="detalle" data-categoria="${p.categoria}">
        <div class="detalle__imagen producto__media">${insigniasHtml(p)}<img src="${p.imagen}" alt="${p.nombre}"></div>
        <div class="detalle__texto">
          <span class="producto__categoria">${nombreCategoria(p.categoria)}</span>
          <h3>${p.nombre}</h3>
          ${valoracionHtml(p)}
          ${precioHtml(p)}
          <p>${p.descripcion}</p>
          <ul class="detalle__lista">${p.detalles.map((d) => `<li>${d}</li>`).join("")}</ul>
          <p class="detalle__stock">${agotado ? "Producto agotado por ahora." : p.stock <= 5 ? `Quedan ${p.stock} unidades.` : "Disponible."}</p>
          <div class="detalle__compra">
            <div class="cantidad" role="group" aria-label="Cantidad">
              <button type="button" data-menos aria-label="Una menos">−</button>
              <output aria-live="polite">${detalleCantidad}</output>
              <button type="button" data-mas aria-label="Una más">+</button>
            </div>
            <button class="boton" type="button" data-agregar-detalle ${agotado ? "disabled" : ""}>${agotado ? "Agotado" : "Agregar al pedido"}</button>
          </div>
        </div>
      </div>`;
    window.pintarIconos(detalle);
    window.pintarEstrellas(detalle);
  }

  function abrirDetalle(id) {
    detalleId = id;
    detalleCantidad = 1;
    pintarDetalle();
    detalle.showModal();
  }

  detalle.addEventListener("click", (e) => {
    if (e.target === detalle || e.target.closest("[data-cerrar]")) return detalle.close();
    const p = detalleId && productoPorId(detalleId);
    if (e.target.closest("[data-mas]")) { detalleCantidad = Math.min(p.stock, detalleCantidad + 1); pintarDetalle(); }
    if (e.target.closest("[data-menos]")) { detalleCantidad = Math.max(1, detalleCantidad - 1); pintarDetalle(); }
    if (e.target.closest("[data-agregar-detalle]")) { agregarAlCarrito(detalleId, detalleCantidad); detalle.close(); }
  });


  /* ---------- 3. CARRITO ---------- */
  let carrito = {};
  try { carrito = JSON.parse(localStorage.getItem("cts-carrito") || "{}"); } catch (e) { carrito = {}; }
  Object.keys(carrito).forEach((id) => { if (!productoPorId(id)) delete carrito[id]; });
  const guardarCarrito = () => { try { localStorage.setItem("cts-carrito", JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ } };

  const cantidadTotal = () => Object.values(carrito).reduce((a, n) => a + n, 0);
  const totalPrecio = () => Object.entries(carrito).reduce((a, [id, n]) => a + productoPorId(id).precio * n, 0);

  /* Botón flotante */
  const botonCarrito = document.createElement("button");
  botonCarrito.className = "carrito-boton";
  botonCarrito.type = "button";
  botonCarrito.innerHTML = `${icono("bolsa")}<span class="carrito-boton__texto">Mi pedido</span><b class="carrito-boton__cuenta" aria-hidden="true">0</b>`;
  document.body.appendChild(botonCarrito);

  /* Panel lateral */
  const panel = document.createElement("dialog");
  panel.className = "carrito";
  panel.setAttribute("aria-label", "Mi pedido");
  document.body.appendChild(panel);

  const aviso = document.createElement("p");
  aviso.className = "solo-lectores";
  aviso.setAttribute("role", "status");
  document.body.appendChild(aviso);

  function pintarCarrito() {
    const ids = Object.keys(carrito);
    const lineas = ids.map((id) => {
      const p = productoPorId(id);
      const n = carrito[id];
      return `
        <li class="linea" data-linea="${id}">
          <img src="${p.imagen}" alt="" width="56" height="56">
          <div>
            <strong>${p.nombre}</strong>
            <span>${dinero(p.precio)} c/u</span>
            <div class="cantidad cantidad--chica" role="group" aria-label="Cantidad de ${p.nombre}">
              <button type="button" data-menos-linea="${id}" aria-label="Una menos">−</button>
              <output>${n}</output>
              <button type="button" data-mas-linea="${id}" aria-label="Una más" ${n >= p.stock ? "disabled" : ""}>+</button>
            </div>
          </div>
          <div class="linea__total"><strong>${dinero(p.precio * n)}</strong><button type="button" data-quitar-linea="${id}" aria-label="Quitar ${p.nombre}">${icono("cerrar")}</button></div>
        </li>`;
    }).join("");

    panel.innerHTML = `
      <div class="carrito__cabecera"><h2>Mi pedido</h2><button class="ventana__cerrar" type="button" data-cerrar aria-label="Cerrar">${icono("cerrar")}</button></div>
      ${ids.length ? `
        <ul class="carrito__lista">${lineas}</ul>
        <div class="carrito__pie">
          <div class="carrito__datos">
            <label for="pedido-nombre">Tu nombre</label>
            <input id="pedido-nombre" type="text" autocomplete="name" placeholder="Escribe tu nombre">
            <label for="pedido-entrega">¿Cómo lo recibes?</label>
            <select id="pedido-entrega">
              <option value="policlinico">Retiro en el policlínico</option>
              <option value="shalom">Envío por Shalom a mi ciudad</option>
            </select>
            <div class="carrito__shalom" hidden>
              <p class="carrito__shalom-info">${icono("camion")} Enviamos a todo el Perú por Shalom. El envío está incluido en el precio, se paga antes de enviar y lo recoges en la agencia Shalom más cercana a tu casa.</p>
              <label for="pedido-recoge">Nombre completo de quien recoge</label>
              <input id="pedido-recoge" type="text" autocomplete="off" placeholder="Tal como aparece en tu documento">
              <label for="pedido-ciudad">Ciudad o provincia de destino</label>
              <input id="pedido-ciudad" type="text" autocomplete="off" placeholder="Ejemplo: Arequipa">
              <label for="pedido-agencia">Agencia Shalom de recojo (opcional)</label>
              <input id="pedido-agencia" type="text" autocomplete="off" placeholder="Si ya sabes cuál te queda cerca">
              <p class="carrito__error" role="alert" hidden></p>
            </div>
          </div>
          <p class="carrito__total"><span>Total</span><strong>${dinero(totalPrecio())}</strong></p>
          <a class="boton boton--whatsapp boton--ancho" data-enviar href="#" target="_blank" rel="noopener">${icono("whatsapp")} Enviar pedido por WhatsApp</a>
          <button class="carrito__vaciar" type="button" data-vaciar>Vaciar pedido</button>
          <p class="carrito__nota">No se cobra nada aquí: te confirmamos disponibilidad y forma de pago por WhatsApp.</p>
        </div>` : `
        <div class="carrito__vacio">
          <span class="panel__icono">${icono("estrella")}</span>
          <p>Tu pedido está vacío. Agrega productos y envíalo por WhatsApp.</p>
          <button class="boton boton--chico" type="button" data-cerrar>Seguir viendo</button>
        </div>`}`;
    window.pintarIconos(panel);
  }

  function pintarBoton(rebote) {
    const total = cantidadTotal();
    $(".carrito-boton__cuenta", botonCarrito).textContent = String(total);
    botonCarrito.classList.toggle("carrito-boton--con", total > 0);
    botonCarrito.setAttribute("aria-label", `Mi pedido: ${total} ${total === 1 ? "producto" : "productos"}`);
    if (rebote && !pausado) {
      botonCarrito.classList.remove("rebote");
      void botonCarrito.offsetWidth;
      botonCarrito.classList.add("rebote");
    }
  }

  function agregarAlCarrito(id, cantidad, origen) {
    const p = productoPorId(id);
    if (!p || p.stock === 0) return;
    carrito[id] = Math.min(p.stock, (carrito[id] || 0) + cantidad);
    guardarCarrito();
    pintarBoton(true);
    aviso.textContent = `${p.nombre} agregado a tu pedido.`;
    if (origen && !pausado) {
      origen.classList.remove("agregado");
      void origen.offsetWidth;
      origen.classList.add("agregado");
    }
  }

  function cambiarLinea(id, paso) {
    const p = productoPorId(id);
    const nueva = (carrito[id] || 0) + paso;
    if (nueva <= 0) delete carrito[id]; else carrito[id] = Math.min(p.stock, nueva);
    guardarCarrito();
    const datos = leerDatosPedido();
    pintarCarrito();
    restaurarDatosPedido(datos);
    pintarBoton(false);
  }

  /* Los datos escritos en el pedido se conservan al cambiar cantidades */
  const CAMPOS_PEDIDO = ["pedido-nombre", "pedido-entrega", "pedido-recoge", "pedido-ciudad", "pedido-agencia"];
  function leerDatosPedido() {
    const datos = {};
    CAMPOS_PEDIDO.forEach((id) => { const c = $(`#${id}`, panel); if (c) datos[id] = c.value; });
    return datos;
  }
  function restaurarDatosPedido(datos) {
    CAMPOS_PEDIDO.forEach((id) => { const c = $(`#${id}`, panel); if (c && datos[id] !== undefined) c.value = datos[id]; });
    mostrarCamposShalom();
  }
  function mostrarCamposShalom() {
    const seleccion = $("#pedido-entrega", panel);
    const caja = $(".carrito__shalom", panel);
    if (seleccion && caja) caja.hidden = seleccion.value !== "shalom";
  }

  /* Devuelve el texto del pedido, o un texto de error si falta algún dato del envío */
  function armarMensaje() {
    const valor = (id) => (($(`#${id}`, panel) || {}).value || "").trim();
    const entrega = valor("pedido-entrega");
    const lineas = Object.entries(carrito).map(([id, n]) => {
      const p = productoPorId(id);
      return `• ${n} x ${p.nombre} (${dinero(p.precio)}) = ${dinero(p.precio * n)}`;
    });
    const nombre = valor("pedido-nombre");
    const salida = [
      `Hola, quiero hacer este pedido${nombre ? `, soy ${nombre}` : ""}:`,
      ...lineas,
      `Total: ${dinero(totalPrecio())}`
    ];

    if (entrega === "shalom") {
      if (!valor("pedido-recoge")) return { error: "Escribe el nombre completo de quien recogerá el paquete.", campo: "pedido-recoge" };
      if (!valor("pedido-ciudad")) return { error: "Escribe la ciudad o provincia de destino.", campo: "pedido-ciudad" };
      salida.push(
        "Forma de recibirlo: envío por Shalom (el envío está incluido en el precio).",
        `Recoge en agencia Shalom: ${valor("pedido-recoge")}.`,
        `Ciudad de destino: ${valor("pedido-ciudad")}.`,
        valor("pedido-agencia") ? `Agencia preferida: ${valor("pedido-agencia")}.` : "Aún no sé qué agencia me queda más cerca.",
        "Entiendo que el pago se realiza antes del envío."
      );
    } else {
      salida.push("Forma de recibirlo: retiro en el policlínico.");
    }
    salida.push("¿Tienen disponibilidad?");
    return { texto: salida.join("\n") };
  }

  botonCarrito.addEventListener("click", () => { pintarCarrito(); panel.showModal(); });
  panel.addEventListener("click", (e) => {
    if (e.target === panel || e.target.closest("[data-cerrar]")) return panel.close();
    const mas = e.target.closest("[data-mas-linea]");
    const menos = e.target.closest("[data-menos-linea]");
    const quitar = e.target.closest("[data-quitar-linea]");
    if (mas) cambiarLinea(mas.dataset.masLinea, 1);
    if (menos) cambiarLinea(menos.dataset.menosLinea, -1);
    if (quitar) cambiarLinea(quitar.dataset.quitarLinea, -999);
    if (e.target.closest("[data-vaciar]")) { carrito = {}; guardarCarrito(); pintarCarrito(); pintarBoton(false); }
    const enviar = e.target.closest("[data-enviar]");
    if (enviar) {
      const mensaje = armarMensaje();
      const error = $(".carrito__error", panel);
      if (mensaje.error) {
        e.preventDefault();
        error.textContent = mensaje.error;
        error.hidden = false;
        $(`#${mensaje.campo}`, panel).focus();
        return;
      }
      if (error) error.hidden = true;
      enviar.href = SITIO.enlaceWhatsApp(mensaje.texto);
    }
  });
  panel.addEventListener("change", (e) => { if (e.target.id === "pedido-entrega") mostrarCamposShalom(); });


  /* ---------- INICIO ---------- */
  actualizar();
  pintarBoton(false);
})();
