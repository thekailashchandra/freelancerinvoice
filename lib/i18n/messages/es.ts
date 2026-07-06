import type { MessageTree } from "@/lib/i18n/types";
import { landingEs } from "@/lib/i18n/messages/landing-es";
import { patchMessages } from "@/lib/i18n/merge-messages";

const esCore: MessageTree = {
  nav: {
    dashboard: "Panel",
    createInvoice: "Crear factura",
    invoiceHistory: "Historial",
    customers: "Clientes",
    settings: "Ajustes",
    features: "Funciones",
    pricing: "Precios",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    getStarted: "Empezar gratis",
  },
  locale: {
    chooseCountry: "País e idioma",
    searchCountries: "Buscar países…",
    languageLabel: "Idioma",
    noCountries: "No se encontraron países",
    commonCountries: "Países comunes. Busca más",
  },
  userMenu: {
    settings: "Ajustes",
    support: "Solicitar ayuda",
    signOut: "Cerrar sesión",
  },
  sidebar: { privacy: "Privacidad" },
  mobileNav: { create: "Crear", history: "Historial" },
  dashboard: {
    title: "Panel",
    subtitle: "Resumen de tus facturas",
    newInvoice: "Nueva factura",
    viewAll: "Ver todo",
    recentInvoices: "Facturas recientes",
    totalInvoices: "Total facturas",
    paid: "Pagadas",
    pending: "Pendientes",
    revenue: "Ingresos",
    emptyTitle: "Aún no hay facturas",
    emptyDescription: "Crea tu primera factura para empezar.",
  },
  settings: {
    title: "Ajustes",
    subtitle: "Datos predeterminados para nuevas facturas",
    save: "Guardar ajustes",
    saving: "Guardando…",
    saved: "Ajustes guardados",
  },
  customers: {
    title: "Clientes",
    subtitle: "Ver clientes guardados, sus facturas y descargar estados de cuenta.",
    createInvoice: "Crear factura",
    search: "Buscar clientes…",
  },
  support: {
    title: "Soporte",
    subtitle: "Envía tu solicitud a nuestro correo de soporte.",
  },
  cookie: {
    message:
      "Usamos cookies de analítica y publicidad opcional para mantener este sitio gratis. Consulta nuestra",
    privacyPolicy: "Política de privacidad",
    cookieSettings: "Configuración de cookies",
    essentialOnly: "Solo esenciales",
    accept: "Aceptar todo",
  },
};

export const es = patchMessages(landingEs, esCore);
