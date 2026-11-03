/* ==========================================================================
   Cuidando tu salud - Catálogo de la tienda
   Para agregar o cambiar un producto, edita esta lista. Los precios y
   valoraciones son DE EJEMPLO: cámbialos por los reales.
   Campos:
     id           nombre corto sin espacios (único)
     nombre       lo que ve el cliente
     categoria    "pies", "espalda" o "bienestar"
     precio       precio actual
     precioAntes  precio anterior (opcional, muestra la oferta)
     stock        unidades disponibles (0 = agotado)
     valoracion   de 1 a 5
     resenas      cantidad de opiniones
     insignia     texto opcional: "Nuevo", "Más pedido", "Recomendado"...
     imagen       ruta de la imagen
     descripcion  texto corto de la tarjeta
     detalles     lista de características
   ========================================================================== */
window.TIENDA = {
  moneda: "S/",
  categorias: [
    { id: "pies", nombre: "Para los pies" },
    { id: "espalda", nombre: "Para la espalda" },
    { id: "bienestar", nombre: "Bienestar" }
  ],
  productos: [
    {
      id: "plantillas", nombre: "Plantillas ortopédicas", categoria: "pies",
      precio: 120, precioAntes: 150, stock: 12, valoracion: 4.9, resenas: 86, insignia: "Más pedido",
      imagen: "assets/images/productos/plantillas.svg",
      descripcion: "Alivian la presión en el talón y el arco. Hechas según tu estudio de pisada.",
      detalles: ["Se hacen a medida después de un estudio de pisada.", "Ayudan en pie plano, pie cavo y fascitis plantar.", "Caben en la mayoría de zapatos cerrados.", "Duración aproximada: 12 a 18 meses."]
    },
    {
      id: "crema", nombre: "Crema hidratante para pies", categoria: "pies",
      precio: 28, stock: 40, valoracion: 4.7, resenas: 54,
      imagen: "assets/images/productos/crema.svg",
      descripcion: "Para piel seca y talones agrietados. De uso diario.",
      detalles: ["Con urea para suavizar durezas.", "Se absorbe rápido y no deja los pies resbalosos.", "Uso: una vez al día, después de la ducha.", "Envase de 100 ml."]
    },
    {
      id: "gel", nombre: "Protector de gel para juanetes", categoria: "pies",
      precio: 35, precioAntes: 42, stock: 25, valoracion: 4.5, resenas: 31,
      imagen: "assets/images/productos/gel.svg",
      descripcion: "Amortigua el roce con el calzado y reduce la molestia al caminar.",
      detalles: ["Gel suave, lavable y reutilizable.", "Se coloca fácil sobre el juanete.", "Viene en pack de 2 unidades."]
    },
    {
      id: "calcetines", nombre: "Calcetines para pie sensible", categoria: "pies",
      precio: 24, stock: 0, valoracion: 4.6, resenas: 22, insignia: "Recomendado",
      imagen: "assets/images/productos/calcetines.svg",
      descripcion: "Sin costuras y de tejido suave, pensados para pies delicados.",
      detalles: ["Sin costuras que rocen la piel.", "Puño flojo que no aprieta.", "Aptos para personas con diabetes."]
    },
    {
      id: "faja", nombre: "Faja lumbar de soporte", categoria: "espalda",
      precio: 89, stock: 9, valoracion: 4.4, resenas: 47,
      imagen: "assets/images/productos/faja.svg",
      descripcion: "Da apoyo a la zona baja de la espalda en trabajos de esfuerzo o largas jornadas.",
      detalles: ["Ajuste regulable con velcro.", "Tela transpirable.", "Tallas S, M, L y XL: indícanos la tuya al pedir.", "No es para usar todo el día: te explicamos cómo usarla."]
    },
    {
      id: "almohada", nombre: "Almohada cervical ergonómica", categoria: "espalda",
      precio: 99, precioAntes: 119, stock: 15, valoracion: 4.8, resenas: 39, insignia: "Nuevo",
      imagen: "assets/images/productos/almohada.svg",
      descripcion: "Mantiene el cuello alineado mientras duermes.",
      detalles: ["Espuma que se adapta a tu cuello.", "Dos alturas para dormir de lado o boca arriba.", "Funda lavable."]
    },
    {
      id: "rodillo", nombre: "Rodillo de masaje", categoria: "bienestar",
      precio: 45, stock: 30, valoracion: 4.6, resenas: 63,
      imagen: "assets/images/productos/rodillo.svg",
      descripcion: "Para aflojar la musculatura en casa entre una sesión y otra.",
      detalles: ["Superficie con relieve para masajear en profundidad.", "Útil en espalda, piernas y planta del pie.", "Incluye guía de ejercicios."]
    },
    {
      id: "banda", nombre: "Banda elástica de ejercicios", categoria: "bienestar",
      precio: 30, stock: 50, valoracion: 4.7, resenas: 71,
      imagen: "assets/images/productos/banda.svg",
      descripcion: "Ideal para los ejercicios que te indicamos en tu plan.",
      detalles: ["Resistencia media.", "Material suave que no irrita la piel.", "Largo de 1,5 metros."]
    }
  ]
};
