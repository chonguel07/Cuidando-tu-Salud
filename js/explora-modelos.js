/* ==========================================================================
   Cuidando tu salud - Modelos 3D de "Explora tu cuerpo"
   Los modelos se construyen con formas de Three.js (no hay archivos externos).
   Cada función devuelve:
     { grupo, piezas }  donde cada pieza es
     { id, region, nombre, objeto, materiales, nav, etiqueta }
   - id: nombre único que usa explora-datos.js para buscar la información
   - nav: si aparece en los botones de "anterior / siguiente"
   Si algún día se cambia a modelos GLB reales, basta con devolver el mismo formato.
   ========================================================================== */
import * as THREE from "three";

const EJE_Y = new THREE.Vector3(0, 1, 0);

function material(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.04, ...extra });
}

/* Cápsula que une dos puntos: sirve para huesos largos */
function capsulaEntre(a, b, radio, mat) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const largo = A.distanceTo(B);
  const malla = new THREE.Mesh(new THREE.CapsuleGeometry(radio, Math.max(largo - radio * 2, 0.001), 6, 14), mat);
  malla.position.copy(A).add(B).multiplyScalar(0.5);
  malla.quaternion.setFromUnitVectors(EJE_Y, B.clone().sub(A).normalize());
  return malla;
}

function elipsoide(pos, escala, mat) {
  const malla = new THREE.Mesh(new THREE.SphereGeometry(1, 26, 18), mat);
  malla.position.set(...pos);
  malla.scale.set(...escala);
  return malla;
}

function tubo(puntos, radio, mat, segmentos = 40) {
  const curva = new THREE.CatmullRomCurve3(puntos.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curva, segmentos, radio, 12, false), mat);
}


/* ==========================================================================
   COLUMNA VERTEBRAL
   ========================================================================== */

/* Interpolación suave de la curva de la columna: [posición 0–1, desplazamiento hacia adelante] */
const CURVA = [[0, 0.05], [0.06, 0.24], [0.14, 0.27], [0.26, 0.06], [0.42, -0.32], [0.58, -0.24], [0.72, 0.12], [0.84, 0.34], [1, 0.24]];

function curvaZ(f) {
  for (let i = 0; i < CURVA.length - 1; i++) {
    const [f0, z0] = CURVA[i];
    const [f1, z1] = CURVA[i + 1];
    if (f <= f1) {
      const t = (f - f0) / (f1 - f0);
      const s = (1 - Math.cos(t * Math.PI)) / 2;
      return z0 + (z1 - z0) * s;
    }
  }
  return CURVA[CURVA.length - 1][1];
}

/* Una vértebra: cuerpo, arco, espina y apófisis transversas. r = radio, h = alto */
function crearVertebra(r, h, mat, { atlas = false, espina = 1, caida = 0.4 } = {}) {
  const g = new THREE.Group();

  if (atlas) {
    const anillo = new THREE.Mesh(new THREE.TorusGeometry(r * 0.85, r * 0.26, 12, 32), mat);
    anillo.rotation.x = Math.PI / 2;
    anillo.scale.set(1, 0.85, 1);
    g.add(anillo);
  } else {
    const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.05, h, 32), mat);
    cuerpo.scale.z = 0.82;
    g.add(cuerpo);
  }

  /* Arco que forma el canal por donde pasa la médula */
  const arco = new THREE.Mesh(new THREE.TorusGeometry(r * 0.52, r * 0.14, 10, 24, Math.PI * 1.25), mat);
  arco.rotation.set(Math.PI / 2, 0, -Math.PI / 2 - (Math.PI * 1.25) / 2);
  arco.position.z = -r * 1.0;
  g.add(arco);

  /* Espina (la que se palpa en la espalda) */
  const largo = r * 1.2 * espina;
  const dir = new THREE.Vector3(0, -caida, -1).normalize();
  const inicio = new THREE.Vector3(0, 0, -r * 1.5);
  const cono = new THREE.Mesh(new THREE.ConeGeometry(r * 0.2, largo, 14), mat);
  cono.quaternion.setFromUnitVectors(EJE_Y, dir);
  cono.position.copy(inicio).addScaledVector(dir, largo / 2);
  g.add(cono);

  /* Apófisis transversas (a los lados) */
  [-1, 1].forEach((lado) => {
    g.add(capsulaEntre([lado * r * 0.5, 0, -r * 1.0], [lado * r * 1.55, 0, -r * 1.15], r * 0.12, mat));
  });

  return g;
}

export function crearColumna(colorDe) {
  const grupo = new THREE.Group();
  const piezas = [];

  const lista = [];
  for (let i = 1; i <= 7; i++) lista.push({ id: `C${i}`, region: "cervical", n: i - 1, de: 7 });
  for (let i = 1; i <= 12; i++) lista.push({ id: `T${i}`, region: "toracica", n: i - 1, de: 12 });
  for (let i = 1; i <= 5; i++) lista.push({ id: `L${i}`, region: "lumbar", n: i - 1, de: 5 });

  const medidas = (v) => {
    if (v.region === "cervical") return { r: 0.17 + v.n * 0.012, h: 0.15, disco: 0.05 };
    if (v.region === "toracica") return { r: 0.22 + (v.n / 11) * 0.09, h: 0.2, disco: 0.07 };
    return { r: 0.35 + v.n * 0.012, h: 0.27, disco: 0.1 };
  };

  /* Alturas acumuladas: primero se calcula el largo total para ubicar la curva */
  let total = 0;
  lista.forEach((v) => { Object.assign(v, medidas(v)); total += v.h + v.disco; });

  let y = 0;
  const anterior = { z: curvaZ(0) };
  lista.forEach((v, i) => {
    const centro = y + v.h / 2;
    const z = curvaZ(centro / total);
    const zSig = curvaZ(Math.min(1, (centro + 0.15) / total));
    const inclinacion = Math.atan2(-(zSig - z), 0.15);

    const mat = material(colorDe(v.region));
    const vertebra = crearVertebra(v.r, v.h, mat, {
      atlas: v.id === "C1",
      espina: v.region === "toracica" ? 1.6 : v.region === "cervical" ? 0.9 : 1.1,
      caida: v.region === "toracica" ? 1.1 : v.region === "cervical" ? 0.15 : 0.1
    });
    vertebra.position.set(0, -centro, z);
    vertebra.rotation.x = inclinacion;
    grupo.add(vertebra);
    piezas.push({ id: v.id, region: v.region, objeto: vertebra, materiales: [mat], nav: true, etiqueta: v.id });
    y += v.h;

    /* Disco entre esta vértebra y la siguiente */
    if (i < lista.length - 1) {
      const sig = lista[i + 1];
      const yDisco = y + v.disco / 2;
      const zD = curvaZ(yDisco / total);
      const matD = material("#f1e3cc", { roughness: 0.8 });
      const disco = new THREE.Mesh(new THREE.CylinderGeometry(v.r * 0.98, v.r * 0.98, v.disco, 32), matD);
      disco.scale.z = 0.82;
      disco.position.set(0, -yDisco, zD);
      disco.rotation.x = inclinacion;
      grupo.add(disco);
      piezas.push({ id: `D-${v.id}-${sig.id}`, region: v.region, objeto: disco, materiales: [matD], nav: false, etiqueta: "Disco" });
    }
    y += v.disco;
    anterior.z = z;
  });

  /* Sacro: hueso triangular un poco inclinado hacia atrás */
  const ultimo = lista[lista.length - 1];
  const ySacro = y;
  const zSacro = curvaZ(1);
  const matS = material(colorDe("sacro"));
  const sacro = new THREE.Group();
  const perfil = [[0.46, 0], [0.44, -0.2], [0.36, -0.55], [0.22, -0.9], [0.1, -1.15]].map(([r, py]) => new THREE.Vector2(r, py));
  const cuerpoSacro = new THREE.Mesh(new THREE.LatheGeometry(perfil, 28), matS);
  cuerpoSacro.scale.z = 0.55;
  sacro.add(cuerpoSacro);
  [-1, 1].forEach((lado) => sacro.add(elipsoide([lado * 0.5, -0.12, -0.04], [0.26, 0.16, 0.2], matS)));
  for (let k = 0; k < 4; k++) sacro.add(elipsoide([0, -0.12 - k * 0.24, -0.28],[0.07, 0.07, 0.08], matS));
  const tilt = 0.5;
  sacro.rotation.x = tilt;
  sacro.position.set(0, -ySacro - 0.02, zSacro - 0.02);
  grupo.add(sacro);
  piezas.push({ id: "S", region: "sacro", objeto: sacro, materiales: [matS], nav: true, etiqueta: "S" });

  /* Cóccix: cuatro huesitos que se curvan hacia adelante */
  const matC = material(colorDe("coccix"));
  const coxis = new THREE.Group();
  const px = 0;
  let py = -ySacro - 0.02 - 1.15 * Math.cos(tilt);
  let pz = zSacro - 0.02 - 1.15 * Math.sin(tilt);
  let ang = tilt;
  [0.1, 0.08, 0.065, 0.05].forEach((radio) => {
    ang -= 0.28;
    const sigPy = py - 0.13 * Math.cos(ang);
    const sigPz = pz - 0.13 * Math.sin(ang);
    coxis.add(capsulaEntre([px, py, pz], [px, sigPy, sigPz], radio, matC));
    py = sigPy;
    pz = sigPz;
  });
  grupo.add(coxis);
  piezas.push({ id: "Co", region: "coccix", objeto: coxis, materiales: [matC], nav: true, etiqueta: "Co" });

  return { grupo, piezas, vista: { acimut: 0.7, polar: 1.35, distancia: 11 } };
}


/* ==========================================================================
   PIE DERECHO (con tobillo)
   Largo en el eje z (los dedos apuntan a +z), el lado interno es +x.
   ========================================================================== */

export function crearPie(colorDe) {
  const grupo = new THREE.Group();
  const piezas = [];

  const nuevaPieza = (id, region, nav, etiqueta, color) => {
    const mat = material(color || colorDe(region));
    const objeto = new THREE.Group();
    grupo.add(objeto);
    const pieza = { id, region, objeto, materiales: [mat], nav, etiqueta };
    piezas.push(pieza);
    return { mat, objeto };
  };

  /* Huesos del tarso (talón y mediopié) */
  const tarsos = [
    ["calcaneo",  "retropie", "Calcáneo",  [0.12, 0.42, -1.95], [0.5, 0.42, 0.85]],
    ["astragalo", "retropie", "Astrágalo", [0.38, 0.92, -1.25], [0.42, 0.3, 0.5]],
    ["navicular", "mediopie", "Navicular", [0.55, 0.68, -0.62], [0.42, 0.24, 0.18]],
    ["cuboide",   "mediopie", "Cuboides",  [-0.25, 0.45, -0.78], [0.3, 0.26, 0.35]],
    ["cun1",      "mediopie", "Cuneif. 1", [0.62, 0.55, -0.22], [0.22, 0.3, 0.22]],
    ["cun2",      "mediopie", "Cuneif. 2", [0.27, 0.5, -0.28], [0.2, 0.26, 0.18]],
    ["cun3",      "mediopie", "Cuneif. 3", [-0.02, 0.5, -0.25], [0.22, 0.26, 0.2]]
  ];
  tarsos.forEach(([id, region, etiqueta, pos, escala]) => {
    const { mat, objeto } = nuevaPieza(id, region, true, etiqueta);
    objeto.add(elipsoide(pos, escala, mat));
  });

  /* Metatarsianos */
  const metas = [
    [[0.62, 0.5, -0.05], [0.85, 0.28, 1.45], 0.16],
    [[0.32, 0.52, -0.05], [0.48, 0.26, 1.55], 0.12],
    [[0.02, 0.48, -0.05], [0.12, 0.25, 1.5], 0.115],
    [[-0.28, 0.45, -0.1], [-0.24, 0.24, 1.4], 0.11],
    [[-0.62, 0.42, -0.45], [-0.6, 0.22, 1.3], 0.115]
  ];
  metas.forEach(([a, b, r], i) => {
    const { mat, objeto } = nuevaPieza(`mt${i + 1}`, "antepie", true, `${i + 1}.º met.`);
    objeto.add(capsulaEntre(a, b, r, mat));
  });

  /* Dedos: cada uno es una lista de falanges [desde, hasta, radio] */
  const dedos = [
    [[[0.88, 0.26, 1.55], [0.92, 0.24, 2.05], 0.14], [[0.92, 0.24, 2.05], [0.95, 0.22, 2.5], 0.125]],
    [[[0.5, 0.24, 1.65], [0.52, 0.22, 2.0], 0.09], [[0.52, 0.22, 2.0], [0.53, 0.21, 2.25], 0.08], [[0.53, 0.21, 2.25], [0.53, 0.2, 2.5], 0.075]],
    [[[0.12, 0.23, 1.6], [0.13, 0.22, 1.92], 0.085], [[0.13, 0.22, 1.92], [0.14, 0.21, 2.14], 0.075], [[0.14, 0.21, 2.14], [0.14, 0.2, 2.34], 0.07]],
    [[[-0.24, 0.23, 1.5], [-0.23, 0.22, 1.8], 0.08], [[-0.23, 0.22, 1.8], [-0.22, 0.21, 2.0], 0.07], [[-0.22, 0.21, 2.0], [-0.22, 0.2, 2.17], 0.065]],
    [[[-0.6, 0.21, 1.4], [-0.61, 0.2, 1.65], 0.075], [[-0.61, 0.2, 1.65], [-0.62, 0.19, 1.82], 0.065], [[-0.62, 0.19, 1.82], [-0.63, 0.18, 1.95], 0.06]]
  ];
  dedos.forEach((falanges, i) => {
    const { mat, objeto } = nuevaPieza(`dedo${i + 1}`, "dedos", true, i === 0 ? "Dedo gordo" : `Dedo ${i + 1}`);
    falanges.forEach(([a, b, r]) => objeto.add(capsulaEntre(a, b, r, mat)));

    /* Uña sobre la última falange */
    const [a, b, r] = falanges[falanges.length - 1];
    const { mat: matUna, objeto: objUna } = nuevaPieza(`una${i + 1}`, "unas", true, `Uña ${i + 1}`);
    const centro = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + r * 0.85, (a[2] + b[2]) / 2 + 0.03];
    objUna.add(elipsoide(centro, [r * 0.85, r * 0.22, (b[2] - a[2]) * 0.48], matUna));
  });

  /* Tobillo: tibia, peroné y tendón de Aquiles */
  const tibia = nuevaPieza("tibia", "tobillo", true, "Tibia");
  tibia.objeto.add(capsulaEntre([0.35, 1.2, -1.2], [0.37, 2.9, -1.15], 0.3, tibia.mat));
  const perone = nuevaPieza("perone", "tobillo", true, "Peroné");
  perone.objeto.add(capsulaEntre([-0.28, 0.95, -1.25], [-0.3, 2.8, -1.3], 0.15, perone.mat));
  const aquiles = nuevaPieza("aquiles", "tobillo", true, "Aquiles", "#e0a35a");
  aquiles.objeto.add(tubo([[0.12, 0.75, -2.35], [0.12, 1.4, -2.15], [0.14, 2.2, -1.8], [0.15, 2.9, -1.6]], 0.15, aquiles.mat));

  /* Tejidos de la planta: arco y fascia */
  const arco = nuevaPieza("arco", "mediopie", true, "Arco", "#25c9bb");
  arco.mat.transparent = true;
  arco.mat.opacity = 0.8;
  arco.objeto.add(tubo([[0.52, 0.1, -2.0], [0.66, 0.22, -0.95], [0.78, 0.26, -0.1], [0.92, 0.1, 1.3]], 0.09, arco.mat));

  const fascia = nuevaPieza("fascia", "mediopie", true, "Fascia", "#ff9a8a");
  [0.78, 0.4, 0.05, -0.3, -0.6].forEach((x, i) => {
    const hasta = [0.88, 0.5, 0.14, -0.24, -0.58][i];
    fascia.objeto.add(tubo([[0.1 + i * 0.01, 0.07, -2.15], [(0.1 + hasta) / 2, 0.06, -0.3], [hasta, 0.07, 1.45]], 0.055, fascia.mat, 24));
  });

  /* Suelo de referencia (no se puede seleccionar) */
  const suelo = new THREE.Mesh(
    new THREE.CircleGeometry(3.4, 64),
    new THREE.MeshStandardMaterial({ color: "#145a7a", roughness: 0.9, transparent: true, opacity: 0.55 })
  );
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.set(0, -0.02, 0.2);
  grupo.add(suelo);

  return { grupo, piezas, vista: { acimut: 2.3, polar: 1.15, distancia: 11.5 } };
}
