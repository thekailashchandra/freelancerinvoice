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
    title: "Wir nutzen Cookies, um diese Seite kostenlos zu halten",
    intro:
      "{name} ist ein kostenloses Rechnungstool für Freelancer. Cookies helfen uns, die App zu betreiben, die Nutzung zu verstehen und — wenn Sie zustimmen — Werbung anzuzeigen, die Hosting und Entwicklung finanziert.",
    pointEssential:
      "Essenzielle Cookies ermöglichen Anmeldung, Sicherheit und Ihre Spracheinstellung. Sie sind immer aktiv.",
    pointAnalytics:
      "Analyse-Cookies (Google Analytics) erfassen anonyme Besuchsstatistiken zur Produktverbesserung.",
    pointAds:
      "Werbe-Cookies (Google AdSense) können relevante Anzeigen zeigen, wenn Sie zustimmen — das hält die Rechnungsstellung kostenlos.",
    pointData:
      "Wir nutzen Cookies nicht, um Rechnungen, Kunden oder Zahlungsdaten in Ihrem Konto zu lesen.",
    privacyLead: "Lesen Sie unsere",
    privacyPolicy: "Datenschutzerklärung",
    cookieSettings: "Cookie-Einstellungen",
    essentialOnly: "Essenziell & Analyse",
    essentialHint: "Keine personalisierte Werbung",
    accept: "Alle Cookies akzeptieren",
    acceptHint: "Werbung + Analyse · unterstützt freien Zugang",
  },
};

export const de = patchMessages(landingDe, deCore);
