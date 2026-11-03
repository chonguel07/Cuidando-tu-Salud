/* ==========================================================================
   Cuidando tu salud - Tratamientos, precios y paquetes (página Servicios)
   Para agregar o cambiar algo, edita esta lista. LOS PRECIOS SON DE EJEMPLO.
   Todos los precios se muestran como "Desde": el valor final depende de la evaluación.
   Imágenes: assets/images/servicios/ (son ilustraciones de muestra; se pueden
   reemplazar por fotos reales con la misma ruta o cambiando "imagen").
   Las descripciones son informativas; conviene que las revise tu profesional.
   ========================================================================== */
window.SERVICIOS = {
  moneda: "S/",

  areas: [
    { id: "podologia", nombre: "Podología" },
    { id: "quiropraxia", nombre: "Quiropraxia" },
    { id: "acupuntura", nombre: "Acupuntura" },
    { id: "biomagnetismo", nombre: "Biomagnetismo" },
    { id: "fisioterapia", nombre: "Fisioterapia" },
    { id: "electroterapia", nombre: "Electroterapia" },
    { id: "masoterapia", nombre: "Masoterapia" },
    { id: "fitoterapia", nombre: "Fitoterapia" },
    { id: "ventosaterapia", nombre: "Ventosaterapia" },
    { id: "reflexologia", nombre: "Reflexología podal" }
  ],

  /* area: debe coincidir con un id de "areas"; desde: precio mínimo; duracion: texto libre */
  tratamientos: [
    /* ----- Podología ----- */
    {
      id: "quiropodia", area: "podologia", nombre: "Atención podológica completa", imagen: "assets/images/servicios/atencioncompleta.jpg",
      descripcion: "Corte y fresado de uñas, retiro de callosidades e hidratación, con material esterilizado y revisión del estado de la piel.",
      ideal: "Mantenimiento periódico de los pies", duracion: "45 min", desde: 50
    },
    {
      id: "una-encarnada", area: "podologia", nombre: "Tratamiento de uña encarnada", imagen: "assets/images/servicios/tratamientouna.jpg",
      descripcion: "Abordaje conservador para aliviar la molestia, con control hasta que la uña recupere un crecimiento correcto.",
      ideal: "Dolor o enrojecimiento junto a la uña", duracion: "30–45 min", desde: 60
    },
    {
      id: "juanetes", area: "podologia", nombre: "Cuidado de juanetes", imagen: "assets/images/servicios/tratamientojuanete.jpg",
      descripcion: "Valoración del pie, protección con ortesis de silicona y recomendaciones de calzado para reducir la presión y la molestia.",
      ideal: "Dolor o roce en la base del dedo gordo", duracion: "40 min", desde: 60
    },
    {
      id: "callos", area: "podologia", nombre: "Callos y durezas", imagen: "assets/images/servicios/tratamientocallos.jpeg",
      descripcion: "Retiro seguro de las zonas de hiperqueratosis y asesoría para reducir el riesgo de que reaparezcan.",
      ideal: "Dolor al caminar con zapatos", duracion: "30 min", desde: 40
    },
    {
      id: "hongos", area: "podologia", nombre: "Hongos en uñas (onicomicosis)", imagen: "assets/images/servicios/tratamientounahongo.jpg",
      descripcion: "Valoración de la uña, desbridado de la zona afectada y pautas de tratamiento tópico según cada caso.",
      ideal: "Uñas amarillas, gruesas o quebradizas", duracion: "40 min", desde: 70
    },
    {
      id: "pie-diabetico", area: "podologia", nombre: "Control del pie diabético", imagen: "assets/images/servicios/tratamientopiediabetico.jpg",
      descripcion: "Revisión periódica de la piel, la sensibilidad y la circulación, con cuidados preventivos para evitar lesiones.",
      ideal: "Personas con diabetes o mala circulación", duracion: "45 min", desde: 60
    },
    {
      id: "plantillas", area: "podologia", nombre: "Estudio de la pisada y plantillas", imagen: "assets/images/servicios/tratamientopisada.jpg",
      descripcion: "Análisis de cómo apoyas el pie al caminar y confección de plantillas personalizadas para repartir mejor la carga.",
      ideal: "Molestias en el talón, el arco o al estar de pie", duracion: "60 min", desde: 150
    },

    /* ----- Terapias holísticas ----- */
    {
      id: "quiropraxia", area: "quiropraxia", nombre: "Ajuste quiropráctico", imagen: "assets/images/servicios/quiropraxia.jpg",
      descripcion: "Valoración de la columna y las articulaciones, con ajustes manuales suaves y pautas de ejercicio para favorecer la movilidad y reducir las molestias musculoesqueléticas.",
      ideal: "Dolor de espalda, cuello o rigidez", duracion: "45 min", desde: 80
    },
    {
      id: "acupuntura", area: "acupuntura", nombre: "Acupuntura", imagen: "assets/images/servicios/acupuntura.jpg",
      descripcion: "Técnica de la medicina tradicional china que consiste en colocar agujas finas, estériles y de un solo uso en puntos específicos. Se emplea como terapia complementaria para el manejo del dolor, la tensión muscular y el estrés.",
      ideal: "Tensión muscular, estrés y dolores recurrentes", duracion: "40–50 min", desde: 70
    },
    {
      id: "biomagnetismo", area: "biomagnetismo", nombre: "Biomagnetismo", imagen: "assets/images/servicios/biomagnetismo.jpg",
      descripcion: "Terapia complementaria que aplica imanes de baja intensidad sobre puntos del cuerpo con fines de relajación y bienestar. No sustituye el diagnóstico ni el tratamiento médico.",
      ideal: "Quienes buscan una terapia complementaria de relajación", duracion: "60 min", desde: 90
    },
    {
      id: "fisioterapia", area: "fisioterapia", nombre: "Fisioterapia y rehabilitación", imagen: "assets/images/servicios/fisioterapia.jpg",
      descripcion: "Evaluación funcional y plan de ejercicios terapéuticos, movilización y técnicas manuales para recuperar movilidad, fuerza y funcionalidad tras lesiones, cirugías o sobrecargas.",
      ideal: "Lesiones, postoperatorios y recuperación funcional", duracion: "45–60 min", desde: 60
    },
    {
      id: "electroterapia", area: "electroterapia", nombre: "Electroterapia", imagen: "assets/images/servicios/electroterapia.jpg",
      descripcion: "Aplicación de corrientes de baja intensidad mediante electrodos, indicada por el profesional como apoyo en el manejo del dolor y en la rehabilitación.",
      ideal: "Complemento de la fisioterapia o la quiropraxia", duracion: "20–30 min", desde: 40
    },
    {
      id: "masoterapia", area: "masoterapia", nombre: "Masoterapia terapéutica", imagen: "assets/images/servicios/masoterapia.jpg",
      descripcion: "Masaje manual orientado a aliviar la tensión muscular, favorecer la relajación y complementar el tratamiento de contracturas.",
      ideal: "Contracturas, cansancio muscular y estrés", duracion: "45–60 min", desde: 60
    },
    {
      id: "fitoterapia", area: "fitoterapia", nombre: "Consulta de fitoterapia", imagen: "assets/images/servicios/fitoterapia.jpg",
      descripcion: "Orientación sobre el uso de plantas medicinales en infusiones, tinturas o cremas, con indicaciones del profesional según cada persona. Complementa, no sustituye, el tratamiento médico.",
      ideal: "Quienes desean apoyo natural a su bienestar", duracion: "30 min", desde: 50
    },
    {
      id: "ventosaterapia", area: "ventosaterapia", nombre: "Ventosaterapia", imagen: "assets/images/servicios/ventosaterapia.jpg",
      descripcion: "Colocación de copas de succión suave sobre la piel para relajar la musculatura de espalda y hombros. Puede dejar marcas circulares temporales.",
      ideal: "Tensión en espalda y hombros", duracion: "30 min", desde: 50
    },
    {
      id: "reflexologia", area: "reflexologia", nombre: "Reflexología podal", imagen: "assets/images/servicios/reflexologia.jpg",
      descripcion: "Masaje con presión en zonas específicas de los pies, orientado a la relajación y al bienestar general.",
      ideal: "Cansancio, piernas pesadas y necesidad de relajarse", duracion: "40 min", desde: 45
    }
  ],

  /* Paquetes y ofertas. "oferta: true" muestra la etiqueta "Oferta del mes" y la fecha de vigencia */
  paquetes: [
    {
      id: "espalda-libre", nombre: "Pack Espalda Libre", tono: "marea", oferta: true,
      incluye: ["4 sesiones de quiropraxia", "2 sesiones de electroterapia", "Plan de ejercicios para casa"],
      desde: 380, antes: 440
    },
    {
      id: "pies-sanos", nombre: "Pack Pies Sanos", tono: "sol", oferta: true,
      incluye: ["Atención podológica completa", "Tratamiento de callos o uñas", "Hidratación profunda"],
      desde: 90, antes: 110
    },
    {
      id: "relax", nombre: "Pack Relax", tono: "noche", oferta: false,
      incluye: ["3 sesiones de masoterapia", "1 sesión de reflexología podal"],
      desde: 200, antes: 235
    },
    {
      id: "acupuntura-5", nombre: "Acupuntura: 5 sesiones", tono: "aqua", oferta: false,
      incluye: ["5 sesiones de acupuntura", "Seguimiento después de cada sesión"],
      desde: 300, antes: 350
    },
    {
      id: "pisada", nombre: "Plantillas + estudio de la pisada", tono: "coral", oferta: true,
      incluye: ["Estudio de la pisada", "Plantillas personalizadas", "Control de ajuste"],
      desde: 150, antes: 180
    },
    {
      id: "postura", nombre: "Pack Postura y Movimiento", tono: "cielo", oferta: false,
      incluye: ["Evaluación postural", "3 sesiones de fisioterapia", "1 ajuste quiropráctico"],
      desde: 260, antes: 300
    }
  ]
};
