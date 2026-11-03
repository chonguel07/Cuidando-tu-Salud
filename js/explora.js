/* ==========================================================================
   Cuidando tu salud - Explorador 3D ("Explora tu cuerpo")
   Un mismo explorador sirve para la columna y para el pie: recibe un modelo,
   sus regiones y una función que devuelve la ficha de cada pieza.
   Índice:
   1. Configuración de cada explorador
   2. Clase Explorador (interfaz, panel, escena 3D)
   3. Inicio (pestañas y arranque perezoso)
   ========================================================================== */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { AVISO, REGIONES_COLUMNA, REGIONES_PIE, fichaColumna, fichaPie } from "./explora-datos.js";
import { crearColumna, crearPie } from "./explora-modelos.js";

const SITIO = window.SITIO;
const pausado = Boolean(window.ANIMACIONES && window.ANIMACIONES.pausadas);
const icono = (id) => (window.iconoSitio ? window.iconoSitio(id) : "");
const EJE_Y = new THREE.Vector3(0, 1, 0);


/* ---------- 1. CONFIGURACIÓN ---------- */
const EXPLORADORES = {
  columna: {
    crear: crearColumna,
    regiones: REGIONES_COLUMNA,
    ficha: fichaColumna,
    etiquetaAria: "Modelo 3D de la columna vertebral. Arrastra para girar, usa la rueda para acercar y toca una vértebra para ver su información.",
    ayuda: "Arrastra para girar · Rueda o pellizco para acercar · Toca una vértebra",
    vacio: "Toca una vértebra del modelo, o elígela en la lista de abajo, para ver su nombre, para qué sirve y cómo cuidarla.",
    servicio: "quiropraxia"
  },
  pie: {
    crear: crearPie,
    regiones: REGIONES_PIE,
    ficha: fichaPie,
    etiquetaAria: "Modelo 3D del pie derecho. Arrastra para girar, usa la rueda para acercar y toca una estructura para ver su información.",
    ayuda: "Arrastra para girar · Rueda o pellizco para acercar · Toca dedos, uñas, talón o arco",
    vacio: "Toca un dedo, una uña, el talón o el arco en el modelo, o elígelo en la lista de abajo, para ver su información.",
    servicio: "podologia"
  }
};

const ACCIONES = [
  ["izq", "izq", "Girar a la izquierda"],
  ["der", "der", "Girar a la derecha"],
  ["mas", null, "Acercar"],
  ["menos", null, "Alejar"],
  ["reiniciar", "reiniciar", "Restablecer la vista"],
  ["auto", "pausa", "Giro automático"],
  ["pantalla", "expandir", "Pantalla completa"]
];


/* ---------- 2. CLASE EXPLORADOR ---------- */
class Explorador {
  constructor(raiz, config) {
    this.raiz = raiz;
    this.config = config;
    this.regionActiva = "todas";
    this.seleccion = null;
    this.marcas = new Set();
    this.pestana = "info";
    this.piezas = [];
    this.listo = false;
    this.visible = false;
    this.autoUsuario = !pausado;

    this.colorDe = (region) => (config.regiones.find((r) => r.id === region) || {}).color || "#ffffff";
    this.construirInterfaz();
  }

  /* ----- Interfaz (HTML) ----- */
  construirInterfaz() {
    const { regiones, etiquetaAria, ayuda } = this.config;
    const botonesRegion = [`<button class="region" type="button" data-region="todas" aria-pressed="true">Todas</button>`]
      .concat(regiones.map((r) => `<button class="region" type="button" data-region="${r.id}" aria-pressed="false" style="--c:${r.color}"><i aria-hidden="true"></i>${r.nombre}<small>${r.rango}</small></button>`))
      .join("");
    const controles = ACCIONES.map(([accion, ico, texto]) => {
      const contenido = ico ? icono(ico) : `<span aria-hidden="true">${accion === "mas" ? "+" : "−"}</span>`;
      return `<button class="control" type="button" data-accion="${accion}" aria-label="${texto}" title="${texto}">${contenido}</button>`;
    }).join("");

    this.raiz.innerHTML = `
      <div class="explorador__escena">
        <div class="explorador__regiones" role="group" aria-label="Regiones">${botonesRegion}</div>
        <div class="explorador__lienzo" tabindex="0" role="application" aria-label="${etiquetaAria}"></div>
        <p class="explorador__carga" data-carga>Preparando el modelo 3D…</p>
        <span class="explorador__etiqueta" data-etiqueta hidden></span>
        <div class="explorador__controles" role="group" aria-label="Controles de la vista">${controles}</div>
        <p class="explorador__ayuda">${ayuda}</p>
      </div>
      <aside class="explorador__panel" aria-live="polite"><div data-panel></div></aside>
      <div class="explorador__inferior">
        <div class="explorador__selector" role="group" aria-label="Elegir una pieza de la lista"></div>
        <div class="explorador__marcas" data-marcas></div>
      </div>`;

    this.lienzo = this.raiz.querySelector(".explorador__lienzo");
    this.panel = this.raiz.querySelector("[data-panel]");
    this.selector = this.raiz.querySelector(".explorador__selector");
    this.cajaMarcas = this.raiz.querySelector("[data-marcas]");
    this.etiqueta = this.raiz.querySelector("[data-etiqueta]");
    this.carga = this.raiz.querySelector("[data-carga]");

    if (!document.fullscreenEnabled) this.raiz.querySelector('[data-accion="pantalla"]').hidden = true;
    if (pausado) this.raiz.querySelector('[data-accion="auto"]').innerHTML = icono("play");

    /* Clics en regiones, controles y selector */
    this.raiz.addEventListener("click", (e) => {
      const region = e.target.closest("[data-region]");
      if (region) return this.elegirRegion(region.dataset.region);
      const accion = e.target.closest("[data-accion]");
      if (accion) return this.accion(accion.dataset.accion);
      const pieza = e.target.closest("[data-pieza]");
      if (pieza) return this.seleccionar(pieza.dataset.pieza === this.seleccion ? null : pieza.dataset.pieza);
      const nav = e.target.closest("[data-vecino]");
      if (nav) return this.vecino(Number(nav.dataset.vecino));
      const pest = e.target.closest("[data-pestana]");
      if (pest) { this.pestana = pest.dataset.pestana; return this.pintarPanel(); }
      const marcar = e.target.closest("[data-marcar]");
      if (marcar) return this.alternarMarca(this.seleccion);
      const quitar = e.target.closest("[data-quitar]");
      if (quitar) return this.alternarMarca(quitar.dataset.quitar);
    });

    this.lienzo.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); this.vecino(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); this.vecino(-1); }
      else if (e.key === "Escape") this.seleccionar(null);
      else if (e.key === "+" || e.key === "=") this.accion("mas");
      else if (e.key === "-") this.accion("menos");
    });

    document.addEventListener("fullscreenchange", () => {
      this.raiz.classList.toggle("explorador--completa", document.fullscreenElement === this.raiz);
      this.ajustarTamano();
    });

    this.pintarPanel();
    this.pintarSelector();
    this.pintarMarcas();
  }

  /* ----- Datos de una pieza ----- */
  ficha(id) { return this.config.ficha(id); }
  pieza(id) { return this.piezas.find((p) => p.id === id); }
  enRegion(p) { return this.regionActiva === "todas" || p.region === this.regionActiva; }
  navegables() { return this.piezas.filter((p) => p.nav && this.enRegion(p)); }

  /* ----- Panel de información ----- */
  pintarPanel() {
    if (!this.seleccion) {
      const leyenda = this.config.regiones.map((r) => `<li><i style="background:${r.color}"></i><strong>${r.nombre}</strong> <span>${r.rango}</span></li>`).join("");
      this.panel.innerHTML = `
        <div class="panel panel--vacio">
          <span class="panel__icono">${icono("cuerpo")}</span>
          <h3>Explora el modelo</h3>
          <p>${this.config.vacio}</p>
          <ul class="panel__leyenda">${leyenda}</ul>
          <p class="panel__aviso">${AVISO}</p>
        </div>`;
      return;
    }

    const f = this.ficha(this.seleccion);
    const region = this.config.regiones.find((r) => r.id === f.region);
    const lista = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    const secciones = {
      info: `<dl><dt>Dónde está</dt><dd>${f.ubicacion}</dd><dt>Para qué sirve</dt><dd>${f.funcion}</dd></dl><h4>Qué debes saber</h4>${lista(f.caracteristicas)}`,
      problemas: `<h4>Problemas frecuentes</h4>${lista(f.problemas)}`,
      cuidados: `<h4>Cómo cuidarlo</h4>${lista(f.cuidados)}`
    };
    const pestanas = [["info", "Qué es"], ["problemas", "Problemas"], ["cuidados", "Cuidados"]]
      .map(([id, texto]) => `<button class="pestana" type="button" role="tab" data-pestana="${id}" aria-selected="${id === this.pestana}">${texto}</button>`).join("");
    const marcada = this.marcas.has(this.seleccion);
    const mensaje = `Hola, quiero consultar por ${f.mensaje}.`;

    this.panel.innerHTML = `
      <div class="panel" style="--c:${region.color}">
        <span class="panel__region"><i></i>${region.nombre}</span>
        <h3>${f.nombre}</h3>
        <div class="panel__nav">
          <button class="mini" type="button" data-vecino="-1" aria-label="Pieza anterior">${icono("izq")} Anterior</button>
          <button class="mini" type="button" data-vecino="1" aria-label="Pieza siguiente">Siguiente ${icono("der")}</button>
        </div>
        <div class="panel__pestanas" role="tablist" aria-label="Información">${pestanas}</div>
        <div class="panel__cuerpo" role="tabpanel">${secciones[this.pestana]}</div>
        <div class="panel__acciones">
          <button class="boton boton--borde boton--chico" type="button" data-marcar aria-pressed="${marcada}">${marcada ? "Quitar de mis zonas" : "Marcar como zona de molestia"}</button>
          <a class="boton boton--whatsapp boton--chico" href="${SITIO.enlaceWhatsApp(mensaje)}" target="_blank" rel="noopener">${icono("whatsapp")} Consultar por esto</a>
        </div>
        <p class="panel__aviso">${AVISO}</p>
      </div>`;
  }

  /* ----- Lista de piezas (también sirve si el 3D no funciona) ----- */
  pintarSelector() {
    const orden = this.config.regiones.map((r) => r.id);
    const piezas = this.piezas.length ? this.piezas : [];
    const botones = piezas
      .filter((p) => p.nav && this.enRegion(p))
      .sort((a, b) => orden.indexOf(a.region) - orden.indexOf(b.region))
      .map((p) => `<button class="pieza-boton" type="button" data-pieza="${p.id}" aria-pressed="${p.id === this.seleccion}" style="--c:${this.colorDe(p.region)}">${p.etiqueta}</button>`);
    this.selector.innerHTML = botones.join("");
  }

  /* ----- Zonas marcadas ----- */
  alternarMarca(id) {
    if (!id) return;
    if (this.marcas.has(id)) this.marcas.delete(id); else this.marcas.add(id);
    this.pintarMarcas();
    if (id === this.seleccion) this.pintarPanel();
  }

  pintarMarcas() {
    if (!this.marcas.size) {
      this.cajaMarcas.innerHTML = `<p class="marcas__vacio">Selecciona una pieza y pulsa “Marcar como zona de molestia”. Podrás enviar tu lista por WhatsApp.</p>`;
      return;
    }
    const chips = [...this.marcas].map((id) => `<span class="marca-chip">${this.ficha(id).nombre}<button type="button" data-quitar="${id}" aria-label="Quitar ${this.ficha(id).nombre}">${icono("cerrar")}</button></span>`).join("");
    const nombres = [...this.marcas].map((id) => this.ficha(id).mensaje).join(", ");
    const enlace = SITIO.enlaceWhatsApp(`Hola, tengo molestias en: ${nombres}. Quiero agendar una evaluación.`);
    this.cajaMarcas.innerHTML = `
      <h4>Mis zonas marcadas (${this.marcas.size})</h4>
      <div class="marcas__lista">${chips}</div>
      <a class="boton boton--whatsapp boton--chico" href="${enlace}" target="_blank" rel="noopener">${icono("whatsapp")} Enviar mi lista por WhatsApp</a>`;
  }

  /* ----- Selección y regiones ----- */
  seleccionar(id) {
    this.seleccion = id;
    this.pestana = "info";
    if (id && !this.enRegion(this.pieza(id))) this.regionActiva = "todas";
    this.actualizarRegionesUI();
    this.pintarPanel();
    this.pintarSelector();
    if (id && this.listo) {
      const p = this.pieza(id);
      const caja = new THREE.Box3().setFromObject(p.objeto);
      const centro = caja.getCenter(new THREE.Vector3());
      const radio = caja.getSize(new THREE.Vector3()).length() / 2;
      const distanciaActual = this.camara.position.distanceTo(this.controles.target);
      this.meta = { centro, distancia: Math.min(Math.max(this.distanciaPara(radio) * 3.2, 6.5), Math.max(distanciaActual, 6.5)) };
    }
  }

  elegirRegion(id) {
    this.regionActiva = id;
    if (this.seleccion && !this.enRegion(this.pieza(this.seleccion))) this.seleccion = null;
    this.actualizarRegionesUI();
    this.pintarPanel();
    this.pintarSelector();
    if (this.listo) this.enfocarRegion();
  }

  actualizarRegionesUI() {
    this.raiz.querySelectorAll("[data-region]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.region === this.regionActiva)));
  }

  vecino(paso) {
    const lista = this.navegables().sort((a, b) => this.config.regiones.findIndex((r) => r.id === a.region) - this.config.regiones.findIndex((r) => r.id === b.region));
    if (!lista.length) return;
    const indice = lista.findIndex((p) => p.id === this.seleccion);
    if (indice !== -1) return this.seleccionar(lista[(indice + paso + lista.length) % lista.length].id);

    /* Si no hay selección, o la pieza no está en la lista (por ejemplo, un disco), se sigue el orden del modelo */
    const todas = this.piezas.map((p) => p.id);
    const posicion = todas.indexOf(this.seleccion);
    const despues = lista.filter((p) => todas.indexOf(p.id) > posicion);
    const antes = lista.filter((p) => todas.indexOf(p.id) < posicion);
    const elegida = paso > 0 ? despues[0] || lista[0] : antes[antes.length - 1] || lista[lista.length - 1];
    this.seleccionar(elegida.id);
  }

  /* ----- Controles de la vista ----- */
  accion(nombre) {
    if (!this.listo) return;
    if (nombre === "izq") this.giro += 0.6;
    if (nombre === "der") this.giro -= 0.6;
    if (nombre === "mas" || nombre === "menos") {
      const distancia = this.camara.position.distanceTo(this.controles.target) * (nombre === "mas" ? 0.72 : 1.38);
      this.meta = { centro: this.controles.target.clone(), distancia: THREE.MathUtils.clamp(distancia, this.controles.minDistance, this.controles.maxDistance) };
    }
    if (nombre === "reiniciar") {
      this.seleccion = null;
      this.regionActiva = "todas";
      this.actualizarRegionesUI();
      this.pintarPanel();
      this.pintarSelector();
      this.enfocarRegion(true);
    }
    if (nombre === "auto") {
      this.autoUsuario = !this.autoUsuario;
      const boton = this.raiz.querySelector('[data-accion="auto"]');
      boton.innerHTML = icono(this.autoUsuario ? "pausa" : "play");
      boton.setAttribute("aria-pressed", String(!this.autoUsuario));
    }
    if (nombre === "pantalla") {
      if (document.fullscreenElement) document.exitFullscreen();
      else this.raiz.requestFullscreen().catch(() => {});
    }
  }

  distanciaPara(radio) {
    const fovV = THREE.MathUtils.degToRad(this.camara.fov);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * this.camara.aspect);
    return radio / Math.sin(Math.min(fovV, fovH) / 2);
  }

  enfocarRegion(reiniciarAngulo = false) {
    const objetos = this.piezas.filter((p) => this.enRegion(p)).map((p) => p.objeto);
    const caja = new THREE.Box3();
    objetos.forEach((o) => caja.expandByObject(o));
    const centro = caja.getCenter(new THREE.Vector3());
    const radio = caja.getSize(new THREE.Vector3()).length() / 2;
    this.meta = { centro, distancia: this.distanciaPara(radio) * 1.02 };
    if (reiniciarAngulo) {
      const { acimut, polar } = this.vista;
      this.meta.dir = new THREE.Vector3().setFromSphericalCoords(1, polar, acimut);
    }
  }

  /* ----- Escena 3D: se crea la primera vez que se muestra ----- */
  activar() {
    this.visible = true;
    if (this.intentado) { this.bucle(); return; }
    this.intentado = true;

    try {
      this.renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      this.carga.textContent = "Tu dispositivo no puede mostrar el modelo 3D. Puedes leer toda la información con la lista de piezas.";
      this.lienzo.hidden = true;
      this.raiz.querySelector(".explorador__controles").hidden = true;
      this.raiz.querySelector(".explorador__regiones").hidden = true;
      this.raiz.classList.add("explorador--sin3d");
      this.cargarSoloDatos();
      return;
    }

    const r = this.renderizador;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    this.lienzo.appendChild(r.domElement);

    this.escena = new THREE.Scene();
    this.camara = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    this.escena.add(new THREE.HemisphereLight(0xffffff, 0x2a4a66, 1.15));
    const clave = new THREE.DirectionalLight(0xffffff, 2.3);
    clave.position.set(4, 7, 6);
    this.escena.add(clave);
    const borde = new THREE.DirectionalLight(0x4fe0d4, 1.6);
    borde.position.set(-5, 2, -5);
    this.escena.add(borde);
    const calida = new THREE.DirectionalLight(0xffb48a, 0.8);
    calida.position.set(-4, -2, 4);
    this.escena.add(calida);

    const modelo = this.config.crear(this.colorDe);
    this.vista = modelo.vista;
    this.piezas = modelo.piezas.map((p) => ({ ...p, op: 1, brillo: 0, hover: false, matsBase: p.materiales.map((m) => ({ transparent: m.transparent, opacity: m.opacity })) }));
    this.escena.add(modelo.grupo);

    /* Se recopilan las mallas que se pueden tocar */
    this.mallas = [];
    this.piezas.forEach((p) => p.objeto.traverse((o) => { if (o.isMesh) { o.userData.pieza = p; this.mallas.push(o); } }));

    this.controles = new OrbitControls(this.camara, r.domElement);
    Object.assign(this.controles, { enableDamping: true, dampingFactor: 0.08, minDistance: 2.5, maxDistance: 24, rotateSpeed: 0.8, autoRotateSpeed: 1.1, screenSpacePanning: true });
    this.controles.addEventListener("start", () => { this.meta = null; this.interactuando = true; this.ultimoToque = performance.now(); });
    this.controles.addEventListener("end", () => { this.interactuando = false; this.ultimoToque = performance.now(); });

    this.giro = 0;
    this.meta = null;
    this.ajustarTamano();
    const { acimut, polar } = this.vista;
    const dir = new THREE.Vector3().setFromSphericalCoords(1, polar, acimut);
    this.enfocarRegion();
    this.controles.target.copy(this.meta.centro);
    this.camara.position.copy(this.meta.centro).addScaledVector(dir, this.meta.distancia * 1.6);
    this.meta.dir = dir;

    this.escucharPuntero();
    new ResizeObserver(() => this.ajustarTamano()).observe(this.lienzo);

    this.listo = true;
    this.carga.hidden = true;
    this.pintarSelector();
    this.pintarMarcas();
    this.bucle();
  }

  /* Si no hay WebGL: se crean solo los datos para que la lista y el panel funcionen */
  cargarSoloDatos() {
    const modelo = this.config.crear(this.colorDe);
    this.piezas = modelo.piezas.map((p) => ({ id: p.id, region: p.region, nav: p.nav, etiqueta: p.etiqueta }));
    this.pintarSelector();
  }

  desactivar() { this.visible = false; }

  ajustarTamano() {
    if (!this.renderizador) return;
    const ancho = this.lienzo.clientWidth;
    const alto = this.lienzo.clientHeight;
    if (!ancho || !alto) return;
    this.renderizador.setSize(ancho, alto, false);
    this.renderizador.domElement.style.width = "100%";
    this.renderizador.domElement.style.height = "100%";
    this.camara.aspect = ancho / alto;
    this.camara.updateProjectionMatrix();
  }

  /* ----- Selección con el puntero ----- */
  escucharPuntero() {
    const canvas = this.renderizador.domElement;
    const rayo = new THREE.Raycaster();
    const punto = new THREE.Vector2();
    let inicio = null;

    const buscar = (e) => {
      const caja = canvas.getBoundingClientRect();
      punto.set(((e.clientX - caja.left) / caja.width) * 2 - 1, -((e.clientY - caja.top) / caja.height) * 2 + 1);
      rayo.setFromCamera(punto, this.camara);
      const golpes = rayo.intersectObjects(this.mallas, false).filter((g) => this.enRegion(g.object.userData.pieza));
      return golpes.length ? golpes[0].object.userData.pieza : null;
    };

    canvas.addEventListener("pointerdown", (e) => { inicio = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    canvas.addEventListener("pointerup", (e) => {
      if (!inicio) return;
      const movido = Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y);
      const duracion = performance.now() - inicio.t;
      inicio = null;
      if (movido > 6 || duracion > 600) return;
      const p = buscar(e);
      this.seleccionar(p ? p.id : null);
      this.lienzo.focus({ preventScroll: true });
    });

    let pendiente = false;
    canvas.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || e.buttons || pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        const p = buscar(e);
        this.piezas.forEach((x) => { x.hover = x === p; });
        canvas.style.cursor = p ? "pointer" : "grab";
        if (p) {
          const caja = this.lienzo.getBoundingClientRect();
          this.etiqueta.textContent = this.ficha(p.id).nombre;
          this.etiqueta.style.left = `${e.clientX - caja.left + 14}px`;
          this.etiqueta.style.top = `${e.clientY - caja.top + 14}px`;
          this.etiqueta.hidden = false;
        } else {
          this.etiqueta.hidden = true;
        }
      });
    });
    canvas.addEventListener("pointerleave", () => {
      this.piezas.forEach((x) => { x.hover = false; });
      this.etiqueta.hidden = true;
    });
  }

  /* ----- Dibujo en cada cuadro ----- */
  bucle() {
    if (this.corriendo || !this.listo) return;
    this.corriendo = true;
    const cuadro = (ahora) => {
      if (!this.visible || document.hidden) { this.corriendo = false; return; }
      this.actualizar(ahora);
      this.renderizador.render(this.escena, this.camara);
      requestAnimationFrame(cuadro);
    };
    requestAnimationFrame(cuadro);
  }

  actualizar(ahora) {
    const suave = pausado ? 1 : 0.1;
    const hayFoco = Boolean(this.seleccion);

    /* Giro con los botones */
    if (Math.abs(this.giro) > 0.001) {
      const paso = this.giro * (pausado ? 1 : 0.14);
      const desfase = this.camara.position.clone().sub(this.controles.target).applyAxisAngle(EJE_Y, paso);
      this.camara.position.copy(this.controles.target).add(desfase);
      this.giro -= paso;
    }

    /* Movimiento de la cámara hacia lo que se quiere mostrar */
    if (this.meta) {
      const m = this.meta;
      this.controles.target.lerp(m.centro, suave);
      let desfase = this.camara.position.clone().sub(this.controles.target);
      let largo = desfase.length();
      let dir = desfase.normalize();
      if (m.dir) dir = dir.lerp(m.dir, suave).normalize();
      largo += (m.distancia - largo) * suave;
      this.camara.position.copy(this.controles.target).addScaledVector(dir, largo);
      if (this.controles.target.distanceTo(m.centro) < 0.01 && Math.abs(largo - m.distancia) < 0.02) this.meta = null;
    }

    /* Giro automático solo si nadie está usando el modelo */
    const quieto = !this.interactuando && ahora - (this.ultimoToque || 0) > 3500;
    this.controles.autoRotate = this.autoUsuario && !pausado && !hayFoco && quieto && !this.marcas.size;
    this.controles.update();

    /* Aspecto de cada pieza: color, brillo y transparencia */
    const pulso = pausado ? 0.4 : 0.32 + 0.22 * Math.sin(ahora / 260);
    this.piezas.forEach((p) => {
      const visible = this.enRegion(p);
      const objetivo = !visible ? 0.1 : hayFoco && p.id !== this.seleccion ? 0.5 : 1;
      p.op += (objetivo - p.op) * suave;

      let brillo = p.hover ? 0.28 : 0;
      let color = 0xffffff;
      if (p.id === this.seleccion) brillo = 0.32;
      if (this.marcas.has(p.id)) { color = 0xff2a2a; brillo = Math.max(brillo, pulso); }
      p.brillo += (brillo - p.brillo) * 0.25;

      p.materiales.forEach((mat, i) => {
        const base = p.matsBase[i];
        const op = p.op * (base.opacity === undefined ? 1 : base.opacity);
        mat.transparent = base.transparent || p.op < 0.99;
        mat.opacity = op;
        mat.depthWrite = p.op > 0.6;
        mat.emissive.setHex(color);
        mat.emissiveIntensity = p.brillo;
      });
    });
  }
}


/* ---------- 3. INICIO ---------- */
const exploradores = {};
window.EXPLORADORES_3D = exploradores; // útil para depurar desde la consola

function crearExplorador(nombre) {
  if (exploradores[nombre]) return exploradores[nombre];
  const raiz = document.querySelector(`[data-explorador="${nombre}"]`);
  if (!raiz) return null;
  exploradores[nombre] = new Explorador(raiz, EXPLORADORES[nombre]);
  return exploradores[nombre];
}

function iniciarPestanas() {
  const pestanas = Array.from(document.querySelectorAll("[data-pestana-modelo]"));
  const paneles = Array.from(document.querySelectorAll("[data-explorador-panel]"));
  let actual = null;

  const mostrar = (nombre, enfocar = false) => {
    actual = nombre;
    pestanas.forEach((t) => {
      const activa = t.dataset.pestanaModelo === nombre;
      t.setAttribute("aria-selected", String(activa));
      t.tabIndex = activa ? 0 : -1;
      if (activa && enfocar) t.focus();
    });
    paneles.forEach((p) => { p.hidden = p.dataset.exploradorPanel !== nombre; });
    Object.entries(exploradores).forEach(([n, ex]) => { if (n !== nombre) ex.desactivar(); });
    const ex = crearExplorador(nombre);
    if (ex) requestAnimationFrame(() => ex.activar());
    history.replaceState(null, "", `#${nombre}`);
  };

  pestanas.forEach((t, i) => {
    t.addEventListener("click", () => mostrar(t.dataset.pestanaModelo));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const destino = pestanas[(i + (e.key === "ArrowRight" ? 1 : -1) + pestanas.length) % pestanas.length];
      mostrar(destino.dataset.pestanaModelo, true);
    });
  });

  /* Solo se dibuja cuando el explorador está en pantalla */
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      const ex = actual && exploradores[actual];
      if (!ex || en.target.dataset.exploradorPanel !== actual) return;
      if (en.isIntersecting) ex.activar(); else ex.desactivar();
    });
  }, { threshold: 0.05 });
  paneles.forEach((p) => observador.observe(p));

  const inicial = location.hash === "#pie" ? "pie" : "columna";
  mostrar(inicial);
}

iniciarPestanas();
