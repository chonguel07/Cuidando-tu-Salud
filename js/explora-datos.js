/* ==========================================================================
   Cuidando tu salud - Textos de "Explora tu cuerpo"
   Aquí se edita toda la información que aparece en los paneles.
   Cada pieza tiene: nombre, ubicacion, funcion, caracteristicas, problemas y cuidados.
   Material educativo: no reemplaza una evaluación profesional.
   ========================================================================== */

export const AVISO = "Información educativa. No reemplaza una evaluación profesional: si tienes dolor, agenda tu cita.";


/* ---------- COLUMNA VERTEBRAL ---------- */

export const REGIONES_COLUMNA = [
  { id: "cervical", nombre: "Cervical", rango: "C1–C7",  color: "#0fb5a8" },
  { id: "toracica", nombre: "Torácica", rango: "T1–T12", color: "#2d9cdb" },
  { id: "lumbar",   nombre: "Lumbar",   rango: "L1–L5",  color: "#ff6f59" },
  { id: "sacro",    nombre: "Sacro",    rango: "S1–S5",  color: "#ffc53d" },
  { id: "coccix",   nombre: "Cóccix",   rango: "Coxis",  color: "#9b6bdc" }
];

const GENERAL_COLUMNA = {
  cervical: {
    ubicacion: "Cuello, entre la base del cráneo y la parte alta de la espalda.",
    funcion: "Sostiene la cabeza y permite girarla, inclinarla y asentir. Protege la médula y las arterias que llevan sangre al cerebro.",
    caracteristicas: [
      "Son 7 vértebras: las más pequeñas y las más móviles.",
      "Tienen orificios laterales por donde pasan las arterias vertebrales.",
      "Forman una curva hacia adelante llamada lordosis cervical."
    ],
    problemas: [
      "Dolor y rigidez de cuello (cervicalgia)",
      "Tensión por el uso del celular o la computadora",
      "Dolores de cabeza que nacen en el cuello",
      "Latigazo cervical después de un golpe o accidente"
    ],
    cuidados: [
      "Sube la pantalla a la altura de los ojos.",
      "Evita mantener el cuello inclinado hacia abajo por mucho rato.",
      "Haz pausas y movimientos suaves de cuello cada hora."
    ]
  },
  toracica: {
    ubicacion: "Parte media y alta de la espalda, detrás del pecho.",
    funcion: "Se une a las costillas para formar la caja torácica, que protege el corazón y los pulmones. Da firmeza al tronco.",
    caracteristicas: [
      "Son 12 vértebras, cada una unida a un par de costillas.",
      "Se mueven poco, porque la caja torácica las sujeta.",
      "Forman una curva hacia atrás llamada cifosis torácica."
    ],
    problemas: [
      "Dolor entre los omóplatos",
      "Rigidez por pasar mucho tiempo encorvado",
      "Dolor al respirar hondo por contracturas de las costillas",
      "Postura encorvada (cifosis postural)"
    ],
    cuidados: [
      "Alterna sentarte y ponerte de pie durante el día.",
      "Abre el pecho y estira los hombros hacia atrás varias veces al día.",
      "Haz ejercicios de espalda alta con una banda elástica."
    ]
  },
  lumbar: {
    ubicacion: "Parte baja de la espalda, entre las costillas y la pelvis.",
    funcion: "Soporta la mayor parte del peso del cuerpo y permite agacharse, estirarse e inclinarse hacia los lados.",
    caracteristicas: [
      "Son 5 vértebras: las más grandes y fuertes.",
      "Forman una curva hacia adentro llamada lordosis lumbar.",
      "Reciben más carga, por eso es la zona que más duele."
    ],
    problemas: [
      "Dolor lumbar (lumbalgia) y contracturas",
      "Hernia de disco",
      "Ciática: dolor que baja por la pierna",
      "Estrechamiento del canal por donde pasan los nervios"
    ],
    cuidados: [
      "Levanta peso doblando las rodillas, no la espalda.",
      "Fortalece el abdomen y los glúteos.",
      "Si trabajas sentado, levántate y camina cada 45 minutos."
    ]
  },
  sacro: {
    ubicacion: "Base de la columna, entre los dos huesos de la cadera.",
    funcion: "Pasa el peso del tronco hacia la pelvis y las piernas. Forma la parte de atrás de la pelvis.",
    caracteristicas: [
      "Son 5 vértebras unidas en un solo hueso con forma de triángulo.",
      "Se une a los huesos de la cadera en las articulaciones sacroilíacas.",
      "Tiene orificios por donde salen nervios hacia la pelvis y las piernas."
    ],
    problemas: [
      "Dolor en la articulación sacroilíaca",
      "Molestia al estar mucho tiempo sentado",
      "Dolor que se siente a un lado de la parte baja de la espalda"
    ],
    cuidados: [
      "Evita cargar el peso siempre sobre una sola pierna.",
      "Cambia de postura con frecuencia al estar sentado.",
      "Mantén fuertes los músculos de la cadera."
    ]
  },
  coccix: {
    ubicacion: "Punta final de la columna, debajo del sacro.",
    funcion: "Sirve de apoyo al sentarse inclinado hacia atrás y es punto de unión de músculos y ligamentos de la pelvis.",
    caracteristicas: [
      "Son de 3 a 5 vértebras muy pequeñas unidas; lo normal es 4.",
      "Es lo que queda de la cola en la evolución humana.",
      "Tiene una ligera curva hacia adelante."
    ],
    problemas: [
      "Dolor de cóccix (coccigodinia) tras una caída",
      "Molestia al sentarse en superficies duras",
      "Dolor después del parto"
    ],
    cuidados: [
      "Usa un cojín con hueco cuando debas estar sentado mucho rato.",
      "Evita sentarte sobre superficies muy duras.",
      "Consulta si el dolor dura más de unos días."
    ]
  }
};

/* Detalles propios de algunas vértebras */
const ESPECIALES_COLUMNA = {
  C1: {
    nombre: "C1 · Atlas",
    ubicacion: "Justo debajo del cráneo.",
    funcion: "Sostiene el cráneo y permite el gesto de asentir con la cabeza, el movimiento del “sí”.",
    caracteristicas: ["No tiene el cuerpo redondo de las demás: es un anillo.", "Toma su nombre del gigante de la mitología que cargaba el mundo."]
  },
  C2: {
    nombre: "C2 · Axis",
    ubicacion: "Debajo del atlas.",
    funcion: "Permite girar la cabeza hacia los lados, el movimiento del “no”.",
    caracteristicas: ["Tiene una prolongación hacia arriba, el diente o apófisis odontoides, sobre la que gira el atlas."]
  },
  C7: {
    nombre: "C7 · Vértebra prominente",
    ubicacion: "En la base del cuello, justo antes de la espalda.",
    funcion: "Es el paso entre el cuello y la espalda.",
    caracteristicas: ["Su espina es larga: se nota como un bulto al inclinar la cabeza hacia adelante."]
  },
  T1: {
    ubicacion: "Base del cuello, justo debajo de C7.",
    caracteristicas: ["Une la parte móvil del cuello con la parte fija de la espalda.", "Se une a la primera costilla."]
  },
  T12: {
    ubicacion: "Al final de la espalda media, justo antes de la zona lumbar.",
    caracteristicas: ["Es la última vértebra con costillas.", "Hace de transición: pasa de una zona rígida a una más móvil, por eso es un punto de tensión."]
  },
  L4: {
    caracteristicas: ["Junto con L5 es una de las vértebras que más trabaja.", "Los nervios que forman el nervio ciático salen cerca de este nivel."]
  },
  L5: {
    caracteristicas: ["Es la última vértebra móvil y soporta el peso de todo lo que está encima.", "El disco entre L5 y el sacro es de los que más se lesionan.", "Los nervios que forman el ciático salen cerca de este nivel."]
  }
};

const GENERAL_DISCO = {
  ubicacion: "Entre dos vértebras.",
  funcion: "Amortigua los golpes y permite que las vértebras se muevan entre sí.",
  caracteristicas: [
    "Tiene un centro blando como gelatina y un anillo exterior resistente.",
    "Se hidrata y se nutre con el movimiento: moverse es bueno para los discos.",
    "Con la edad o el exceso de carga pierde agua y altura."
  ],
  problemas: [
    "Abultamiento o hernia de disco",
    "Desgaste (degeneración discal)",
    "Dolor que se irradia hacia brazos o piernas si roza un nervio"
  ],
  cuidados: [
    "Mantén un peso saludable y una buena postura.",
    "Camina todos los días.",
    "Evita cargar peso con la espalda doblada."
  ]
};

/* Devuelve la ficha de una pieza de la columna. id: "C1", "T5", "L4", "S", "Co" o "D-L4-L5" */
export function fichaColumna(id) {
  if (id.startsWith("D-")) {
    const [, arriba, abajo] = id.split("-");
    const region = regionDeVertebra(arriba);
    return { ...GENERAL_DISCO, nombre: `Disco ${arriba}–${abajo}`, region, mensaje: `el disco ${arriba}–${abajo}` };
  }
  if (id === "S") {
    return { ...GENERAL_COLUMNA.sacro, nombre: "Sacro (S1–S5)", region: "sacro", mensaje: "el sacro" };
  }
  if (id === "Co") {
    return { ...GENERAL_COLUMNA.coccix, nombre: "Cóccix", region: "coccix", mensaje: "el cóccix" };
  }
  const region = regionDeVertebra(id);
  const base = GENERAL_COLUMNA[region];
  const extra = ESPECIALES_COLUMNA[id] || {};
  return {
    ...base,
    ...extra,
    nombre: extra.nombre || `${id} · Vértebra ${NOMBRE_REGION[region]}`,
    caracteristicas: extra.caracteristicas ? [...extra.caracteristicas, ...base.caracteristicas] : base.caracteristicas,
    region,
    mensaje: `la vértebra ${id}`
  };
}

const NOMBRE_REGION = { cervical: "cervical", toracica: "torácica", lumbar: "lumbar" };

export function regionDeVertebra(id) {
  return { C: "cervical", T: "toracica", L: "lumbar" }[id[0]];
}


/* ---------- PIE ---------- */

export const REGIONES_PIE = [
  { id: "dedos",    nombre: "Dedos",    rango: "Falanges",           color: "#ff6f59" },
  { id: "unas",     nombre: "Uñas",     rango: "Protección",         color: "#ffc53d" },
  { id: "antepie",  nombre: "Antepié",  rango: "Metatarsianos",      color: "#2d9cdb" },
  { id: "mediopie", nombre: "Mediopié", rango: "Arco y fascia",      color: "#0fb5a8" },
  { id: "retropie", nombre: "Talón",    rango: "Calcáneo y astrágalo", color: "#9b6bdc" },
  { id: "tobillo",  nombre: "Tobillo",  rango: "Tibia, peroné y Aquiles", color: "#6f93b8" }
];

const DEDOS = {
  dedo1: {
    nombre: "Dedo gordo (hallux)",
    ubicacion: "Borde interno del pie, el dedo más grande.",
    funcion: "Da el último impulso al caminar y ayuda a mantener el equilibrio. Soporta gran parte de la fuerza al despegar el pie.",
    caracteristicas: ["Tiene 2 huesos (falanges), a diferencia de los otros dedos que tienen 3.", "Se une al primer metatarsiano en una articulación muy cargada."],
    problemas: ["Juanete (hallux valgus): el dedo se desvía hacia los demás", "Uña encarnada", "Rigidez y dolor al empujar (hallux rigidus)", "Dolor repentino por ácido úrico (gota)"],
    cuidados: ["Usa calzado con la punta ancha.", "Corta la uña recta.", "Consulta si el dedo se desvía o duele al caminar."]
  },
  otros: {
    ubicacion: "Los cuatro dedos menores, junto al dedo gordo.",
    funcion: "Dan estabilidad y ayudan a repartir el peso al caminar.",
    caracteristicas: ["Cada uno tiene 3 huesos pequeños (falanges).", "Son flexibles, pero se deforman fácilmente por el calzado apretado."],
    problemas: ["Dedos en garra o en martillo", "Callos y ojos de gallo por roce", "Hongos entre los dedos", "Dolor por golpes"],
    cuidados: ["Seca bien entre los dedos.", "Evita calzado que los apriete.", "No cortes los callos tú mismo: consulta al podólogo."]
  }
};

const NOMBRES_DEDO = { dedo2: "Segundo dedo", dedo3: "Tercer dedo", dedo4: "Cuarto dedo", dedo5: "Quinto dedo (meñique)" };

const UNAS = {
  ubicacion: "Punta de cada dedo, sobre la última falange.",
  funcion: "Protegen la punta del dedo y ayudan a sentir y a sujetar.",
  caracteristicas: ["Crecen unos 1–2 mm al mes; las de los pies, más lento que las de las manos.", "Son un buen indicador de salud: color y grosor cambian cuando algo no está bien."],
  problemas: ["Uña encarnada (onicocriptosis)", "Hongos (onicomicosis): uña gruesa, amarilla o frágil", "Golpes o uñas negras por calzado apretado", "Uñas muy gruesas o curvas"],
  cuidados: ["Córtalas rectas, sin redondear las esquinas.", "No las dejes muy cortas.", "Si hay dolor, pus o enrojecimiento, consulta pronto."]
};

const METATARSIANOS = {
  ubicacion: "Zona delantera del pie, entre el mediopié y los dedos.",
  funcion: "Reparten el peso al caminar y correr, y ayudan a empujar el cuerpo hacia adelante.",
  caracteristicas: ["Son 5 huesos largos, numerados del 1 (junto al dedo gordo) al 5.", "El primero es el más grueso y soporta más carga."],
  problemas: ["Dolor en la planta delantera (metatarsalgia)", "Neuroma de Morton: ardor entre los dedos", "Callosidades bajo el pie", "Fracturas por estrés en deportistas"],
  cuidados: ["Usa calzado con buena amortiguación.", "Evita los tacones altos por muchas horas.", "Una plantilla a medida reparte mejor la carga."]
};

const FICHAS_PIE = {
  navicular: {
    nombre: "Navicular", region: "mediopie",
    ubicacion: "Parte interna del mediopié, delante del astrágalo.",
    funcion: "Es la pieza clave del arco interno del pie.",
    caracteristicas: ["Tiene forma de barco pequeño.", "Soporta mucha presión al caminar."],
    problemas: ["Dolor en el arco por sobrecarga", "Fractura por estrés en deportistas", "Pie plano si el arco cae"],
    cuidados: ["Aumenta el ejercicio poco a poco.", "Usa calzado con soporte en el arco."]
  },
  cuboide: {
    nombre: "Cuboides", region: "mediopie",
    ubicacion: "Parte externa del mediopié.",
    funcion: "Da estabilidad al borde externo del pie y es un punto de apoyo al caminar.",
    caracteristicas: ["Tiene forma de cubo.", "Se une al talón y a los dos últimos metatarsianos."],
    problemas: ["Dolor en el borde externo del pie", "Esguinces repetidos de tobillo"],
    cuidados: ["Fortalece los músculos del tobillo.", "Consulta si el dolor aparece después de una torcedura."]
  },
  cun1: { nombre: "Cuneiforme medial", region: "mediopie", ubicacion: "Mediopié, lado interno.", funcion: "Sostiene la base del primer metatarsiano.", caracteristicas: ["Forma de cuña.", "Ayuda a formar la bóveda del pie."], problemas: ["Dolor en el arco", "Alteraciones de la pisada"], cuidados: ["Estudio de pisada si notas desgaste desigual del calzado."] },
  cun2: { nombre: "Cuneiforme intermedio", region: "mediopie", ubicacion: "Mediopié, zona central.", funcion: "Da estabilidad al centro del arco.", caracteristicas: ["Es el más pequeño de los tres cuneiformes.", "Se une al segundo metatarsiano."], problemas: ["Dolor en el dorso del pie", "Lesiones por golpe directo"], cuidados: ["Cuida la forma de atarte el calzado: no lo aprietes de más."] },
  cun3: { nombre: "Cuneiforme lateral", region: "mediopie", ubicacion: "Mediopié, entre el intermedio y el cuboides.", funcion: "Ayuda a repartir la carga hacia el tercer metatarsiano.", caracteristicas: ["Forma de cuña.", "Se une al navicular y al cuboides."], problemas: ["Dolor al apoyar", "Sobrecarga por calzado rígido"], cuidados: ["Alterna el calzado y evita suelas muy duras."] },
  astragalo: {
    nombre: "Astrágalo", region: "retropie",
    ubicacion: "Debajo de la tibia, sobre el talón.",
    funcion: "Une la pierna con el pie: pasa el peso del cuerpo hacia el talón y el resto del pie.",
    caracteristicas: ["Ningún músculo se une directamente a él.", "Es muy importante para la movilidad del tobillo."],
    problemas: ["Esguinces de tobillo", "Rigidez de tobillo", "Lesiones del cartílago"],
    cuidados: ["Fortalece el tobillo con ejercicios de equilibrio.", "No sigas haciendo deporte con un tobillo hinchado."]
  },
  calcaneo: {
    nombre: "Calcáneo (talón)", region: "retropie",
    ubicacion: "Parte de atrás del pie.",
    funcion: "Recibe el primer impacto al caminar y es el punto de unión del tendón de Aquiles y la fascia plantar.",
    caracteristicas: ["Es el hueso más grande del pie.", "Está rodeado por una almohadilla de grasa que amortigua."],
    problemas: ["Dolor de talón (talalgia)", "Espolón calcáneo", "Fascitis plantar", "Dolor de talón en niños que practican deporte (enfermedad de Sever)"],
    cuidados: ["Usa calzado con buena amortiguación en el talón.", "Estira la pantorrilla todos los días.", "Evita caminar descalzo sobre superficies duras."]
  },
  arco: {
    nombre: "Arco plantar", region: "mediopie",
    ubicacion: "Parte interna de la planta del pie, entre el talón y los dedos.",
    funcion: "Actúa como un resorte: amortigua el impacto y ayuda a impulsarte al caminar.",
    caracteristicas: ["Lo forman huesos, ligamentos y músculos trabajando juntos.", "Cada persona tiene una altura de arco distinta."],
    problemas: ["Pie plano: el arco es muy bajo", "Pie cavo: el arco es muy alto", "Cansancio y dolor al estar de pie", "Dolor en rodillas o espalda por una mala pisada"],
    cuidados: ["Pide un estudio de pisada.", "Una plantilla a medida puede corregir y aliviar.", "Fortalece los músculos del pie con ejercicios simples."]
  },
  fascia: {
    nombre: "Fascia plantar", region: "mediopie",
    ubicacion: "Bajo la planta, desde el talón hasta la base de los dedos.",
    funcion: "Es una banda fuerte que sostiene el arco y absorbe el impacto en cada paso.",
    caracteristicas: ["Es un tejido grueso y resistente.", "Se tensa al levantar los dedos del pie."],
    problemas: ["Fascitis plantar: dolor en el talón, sobre todo con los primeros pasos de la mañana", "Dolor por exceso de actividad o sobrepeso"],
    cuidados: ["Estira la planta del pie y la pantorrilla.", "Usa calzado con soporte.", "Una plantilla puede descargar la zona."]
  },
  aquiles: {
    nombre: "Tendón de Aquiles", region: "tobillo",
    ubicacion: "Parte de atrás del tobillo, desde la pantorrilla hasta el talón.",
    funcion: "Une los músculos de la pantorrilla con el talón: permite ponerse de puntillas, saltar y correr.",
    caracteristicas: ["Es el tendón más grueso y fuerte del cuerpo.", "Tiene poca irrigación, por eso se recupera lento."],
    problemas: ["Tendinitis de Aquiles", "Dolor al iniciar el ejercicio", "Rotura, sobre todo en deportes con saltos"],
    cuidados: ["Calienta y estira antes de hacer deporte.", "Aumenta la intensidad poco a poco.", "No ignores un dolor que dura más de una semana."]
  },
  tibia: {
    nombre: "Tibia", region: "tobillo",
    ubicacion: "Hueso grueso de la parte interna de la pierna, hasta el tobillo.",
    funcion: "Soporta el peso del cuerpo y lo pasa al pie por el tobillo.",
    caracteristicas: ["Su extremo inferior forma el bulto interno del tobillo.", "Es el hueso más fuerte de la pierna."],
    problemas: ["Dolor en la espinilla al correr (periostitis tibial)", "Fracturas por estrés"],
    cuidados: ["Usa zapatillas adecuadas para tu actividad.", "Descansa si aparece dolor en la espinilla."]
  },
  perone: {
    nombre: "Peroné", region: "tobillo",
    ubicacion: "Hueso delgado de la parte externa de la pierna.",
    funcion: "Da estabilidad al tobillo y sirve de unión para músculos.",
    caracteristicas: ["Soporta poco peso.", "Su extremo inferior forma el bulto externo del tobillo."],
    problemas: ["Esguinces de tobillo", "Fracturas por torceduras"],
    cuidados: ["Fortalece el tobillo.", "Usa calzado estable en terrenos irregulares."]
  }
};

/* Devuelve la ficha de una pieza del pie. id: "dedo1", "una3", "mt2", "navicular"... */
export function fichaPie(id) {
  if (id === "dedo1") return { ...DEDOS.dedo1, region: "dedos", mensaje: "el dedo gordo del pie" };
  if (id.startsWith("dedo")) return { ...DEDOS.otros, nombre: NOMBRES_DEDO[id], region: "dedos", mensaje: `el ${NOMBRES_DEDO[id].toLowerCase()} del pie` };
  if (id.startsWith("una")) {
    const n = id.slice(3);
    const nombre = n === "1" ? "Uña del dedo gordo" : `Uña del ${NOMBRES_DEDO["dedo" + n].toLowerCase()}`;
    return { ...UNAS, nombre, region: "unas", mensaje: `la ${nombre.toLowerCase()}` };
  }
  if (id.startsWith("mt")) {
    const n = id.slice(2);
    return { ...METATARSIANOS, nombre: `${n}.º metatarsiano`, region: "antepie", mensaje: `el ${n}.º metatarsiano` };
  }
  const ficha = FICHAS_PIE[id];
  return { ...ficha, mensaje: ficha.nombre.toLowerCase() };
}
