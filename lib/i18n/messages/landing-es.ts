import type { MessageTree } from "@/lib/i18n/types";

/** Spanish translations for landing page and public navigation. */
export const landingEs: MessageTree = {
  nav: {
    guides: "Guías",
    blog: "Blog",
    templates: "Plantillas",
    home: "Inicio",
    about: "Acerca de",
    contact: "Contacto",
    indiaInvoicing: "Facturación en India",
    freelanceFinances: "Finanzas freelance",
    globalCompliance: "Cumplimiento global",
    privacyPolicy: "Política de privacidad",
    terms: "Términos",
    refundPolicy: "Política de reembolso",
    login: "Iniciar sesión",
    signup: "Registrarse",
    menu: "Menú",
    openMenu: "Abrir menú",
  },
  guides: {
    label: "Guías",
    learn: "Aprender",
    allGuides: "Todas las guías de facturación",
    financesHub: "Centro de finanzas freelance",
    popularArticles: "Artículos populares",
    viewAll: "Ver todas las guías",
    minRead: "min de lectura",
  },
  footer: {
    tagline: "Generador de facturas gratuito para freelancers",
    sitemap: "Mapa del sitio",
    llmsTxt: "LLMs.txt",
  },
  geo: {
    keyFacts: "Datos clave",
    summary:
      "Respuestas rápidas para freelancers que evalúan un generador de facturas gratuito.",
  },
  landing: {
    hero: {
      badge: "Creado para freelancers y agencias",
      titlePrefix: "Gratis",
      titleHighlight: "Factura para freelancers",
      titleSuffix: ": facturación profesional en minutos",
      description:
        "{name} es la forma más rápida de crear una factura para trabajo freelance. Genera facturas PDF atractivas, haz seguimiento de pagos y gestiona todo tu flujo de facturación freelance en una plataforma en la nube, sin hojas de cálculo ni plantillas desordenadas.",
      ctaPrimary: "Crea tu primera factura de freelancer",
      ctaFeatures: "Ver funciones",
      ctaSignIn: "Iniciar sesión",
      metaFree: "Gratis para empezar",
      metaPricing: "Ver precios",
      metaPdf: "Exportar PDF",
      metaCloud: "Historial de facturas en la nube",
    },
    features: {
      title: "Todo lo que los freelancers necesitan para facturar a clientes",
      subtitle:
        "Desde tu primer proyecto freelance hasta una cartera completa de clientes, nuestro generador de facturas mantiene la facturación simple, profesional y organizada.",
      f1: {
        title: "Facturas profesionales para freelancers",
        description:
          "Crea facturas pulidas para trabajo freelance con vista previa en vivo, tu logo, líneas detalladas y exportación PDF con un clic.",
      },
      f2: {
        title: "Almacenamiento de facturas en la nube",
        description:
          "Cada factura de freelancer se guarda de forma segura en la nube. Accede a tu historial de facturación desde cualquier dispositivo.",
      },
      f3: {
        title: "Historial y filtros de facturas",
        description:
          "Haz seguimiento de facturas freelance pagadas, pendientes y vencidas con búsqueda y filtros de estado diseñados para contratistas ocupados.",
      },
      f4: {
        title: "Cuentas seguras y aisladas",
        description:
          "La seguridad a nivel de fila mantiene privada cada cuenta de freelancer. Tus clientes y facturas son solo tuyos.",
      },
      f5: {
        title: "Exportación PDF",
        description:
          "Descarga una factura PDF lista para el cliente en segundos, sin formato manual en Word o Excel.",
      },
      f6: {
        title: "Facturación multi-moneda",
        description:
          "Factura a clientes internacionales con la moneda correcta y campos de pago específicos del país en cada factura.",
      },
    },
    about: {
      title: "¿Qué es una factura para freelancers?",
      p1: "Una factura para freelancers es el documento que envías tras completar un trabajo para solicitar el pago a un cliente. A diferencia de los empleados que reciben nómina, los freelancers y contratistas independientes deben facturar cada proyecto, hora o período de retención.",
      p2: "Muchos freelancers aún luchan con plantillas de Word, Google Sheets o herramientas genéricas. {name} elimina esa fricción: obtienes vista previa en vivo, PDFs con marca y un historial buscable de cada factura que has enviado.",
    },
    steps: {
      title: "Cómo crear una factura para trabajo freelance",
      subtitle:
        "Tres pasos desde el registro hasta un PDF listo para el cliente. La mayoría de freelancers terminan su primera factura en menos de cinco minutos.",
      s1: {
        title: "Crea tu cuenta gratuita",
        description:
          "Regístrate en menos de un minuto. Añade una vez el nombre de tu negocio freelance, logo y datos de pago predeterminados.",
      },
      s2: {
        title: "Crea tu factura",
        description:
          "Introduce datos del cliente, servicios, tarifas y fechas de vencimiento. Observa cómo se actualiza tu factura de freelancer en tiempo real.",
      },
      s3: {
        title: "Envía y cobra",
        description:
          "Exporta un PDF profesional, envíalo por correo a tu cliente y haz seguimiento del estado de pago desde tu panel.",
      },
    },
    benefits: {
      title: "Por qué los freelancers eligen {name}",
      intro:
        "Ya seas diseñador, desarrollador, escritor, marketer o consultor, cobrar a tiempo empieza con una factura clara y profesional.",
      cta: "Empieza a facturar gratis",
      b1: "Generador de facturas gratuito diseñado específicamente para freelancers",
      b2: "Sin hojas de cálculo ni plantillas de Word rotas",
      b3: "Facturas PDF con marca que lucen profesionales ante cada cliente",
      b4: "Sincronización en la nube para no perder nunca una factura freelance",
      b5: "Seguimiento de pagos para facturas pagadas, pendientes y vencidas",
      b6: "Para diseñadores, desarrolladores, escritores, consultores y agencias",
    },
    useCases: {
      title: "Para todo tipo de facturación freelance",
      u1: {
        title: "Trabajo freelance por proyecto",
        body: "Factura a clientes por entregables de alcance fijo, desde sitios web y paquetes de marca hasta redacción y consultoría, con líneas y totales claros.",
      },
      u2: {
        title: "Facturación por horas y retención",
        body: "Factura horas freelance o retenciones mensuales con líneas descriptivas para que los clientes entiendan exactamente por qué pagan.",
      },
      u3: {
        title: "Clientes internacionales",
        body: "Envía facturas por servicios freelance en todo el mundo con moneda configurable y datos de pago que coincidan con cómo realmente cobras.",
      },
    },
    guideSection: {
      title: "Guías de facturación para freelancers",
      subtitle:
        "Artículos en profundidad sobre facturación internacional, impuestos freelance, condiciones de pago y mejores prácticas de facturación.",
    },
    faq: {
      title: "Preguntas frecuentes sobre facturas para freelancers",
      subtitle:
        "Respuestas a preguntas comunes sobre crear facturas para freelancers, exportación PDF, seguridad y cobrar más rápido.",
    },
    cta: {
      title: "¿Listo para crear tu factura de freelancer?",
      descriptionBefore:
        "Únete a miles de freelancers que facturan profesionalmente con {name}.",
      descriptionAfter: ", exportación PDF instantánea, historial de facturas en la nube.",
      freeLink: "Gratis para siempre",
      primary: "Empieza, es gratis",
      secondary: "Leer guías para freelancers",
    },
  },
};
