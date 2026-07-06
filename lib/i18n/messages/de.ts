import type { MessageTree } from "@/lib/i18n/types";
import { landingDe } from "@/lib/i18n/messages/landing-de";
import { patchMessages } from "@/lib/i18n/merge-messages";

const deCore: MessageTree = {
  nav: {
    dashboard: "Dashboard",
    createInvoice: "Rechnung erstellen",
    invoiceHistory: "Rechnungsverlauf",
    customers: "Kunden",
    settings: "Einstellungen",
    features: "Funktionen",
    pricing: "Preise",
    signIn: "Anmelden",
    signUp: "Registrieren",
    getStarted: "Kostenlos starten",
  },
  locale: {
    chooseCountry: "Land und Sprache",
    searchCountries: "Länder suchen…",
    languageLabel: "Sprache",
    noCountries: "Keine Länder gefunden",
    commonCountries: "Häufige Länder. Suchen für mehr",
  },
  userMenu: {
    settings: "Einstellungen",
    support: "Anfrage senden",
    signOut: "Abmelden",
  },
  sidebar: { privacy: "Datenschutz" },
  mobileNav: { create: "Erstellen", history: "Verlauf" },
  dashboard: {
    title: "Dashboard",
    subtitle: "Übersicht Ihrer Rechnungen",
    newInvoice: "Neue Rechnung",
    viewAll: "Alle anzeigen",
    recentInvoices: "Letzte Rechnungen",
    totalInvoices: "Rechnungen gesamt",
    paid: "Bezahlt",
    pending: "Ausstehend",
    revenue: "Umsatz",
    emptyTitle: "Noch keine Rechnungen",
    emptyDescription: "Erstellen Sie Ihre erste Rechnung.",
  },
  settings: {
    title: "Einstellungen",
    subtitle: "Standarddaten für neue Rechnungen",
    save: "Speichern",
    saving: "Speichern…",
    saved: "Einstellungen gespeichert",
  },
  customers: {
    title: "Kunden",
    subtitle: "Gespeicherte Kunden, Rechnungen und Kontoauszüge anzeigen.",
    createInvoice: "Rechnung erstellen",
    search: "Kunden suchen…",
  },
  support: {
    title: "Support",
    subtitle: "Ihre Anfrage wird an unsere Support-E-Mail gesendet.",
  },
  cookie: {
    message:
      "Wir nutzen Cookies für Analyse und optionale Werbung, um diese Seite kostenlos zu halten. Siehe unsere",
    privacyPolicy: "Datenschutzerklärung",
    cookieSettings: "Cookie-Einstellungen",
    essentialOnly: "Nur essenziell",
    accept: "Alle akzeptieren",
  },
};

export const de = patchMessages(landingDe, deCore);
