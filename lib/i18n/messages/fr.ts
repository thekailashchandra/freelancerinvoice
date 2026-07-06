import type { MessageTree } from "@/lib/i18n/types";
import { landingFr } from "@/lib/i18n/messages/landing-fr";
import { patchMessages } from "@/lib/i18n/merge-messages";

const frCore: MessageTree = {
  nav: {
    dashboard: "Tableau de bord",
    createInvoice: "Créer une facture",
    invoiceHistory: "Historique",
    customers: "Clients",
    settings: "Paramètres",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    signIn: "Connexion",
    signUp: "Inscription",
    getStarted: "Commencer gratuitement",
  },
  locale: {
    chooseCountry: "Pays et langue",
    searchCountries: "Rechercher un pays…",
    languageLabel: "Langue",
    noCountries: "Aucun pays trouvé",
    commonCountries: "Pays courants. Recherchez pour plus",
  },
  userMenu: {
    settings: "Paramètres",
    support: "Demande d'aide",
    signOut: "Déconnexion",
  },
  sidebar: { privacy: "Confidentialité" },
  mobileNav: { create: "Créer", history: "Historique" },
  dashboard: {
    title: "Tableau de bord",
    subtitle: "Aperçu de vos factures",
    newInvoice: "Nouvelle facture",
    viewAll: "Tout voir",
    recentInvoices: "Factures récentes",
    totalInvoices: "Total factures",
    paid: "Payées",
    pending: "En attente",
    revenue: "Revenus",
    emptyTitle: "Aucune facture",
    emptyDescription: "Créez votre première facture pour commencer.",
  },
  settings: {
    title: "Paramètres",
    subtitle: "Détails par défaut pour les nouvelles factures",
    save: "Enregistrer",
    saving: "Enregistrement…",
    saved: "Paramètres enregistrés",
  },
  customers: {
    title: "Clients",
    subtitle: "Voir les clients enregistrés, leurs factures et télécharger des relevés.",
    createInvoice: "Créer une facture",
    search: "Rechercher des clients…",
  },
  support: {
    title: "Assistance",
    subtitle: "Votre demande sera envoyée à notre e-mail d'assistance.",
  },
  cookie: {
    message:
      "Nous utilisons des cookies d'analyse et de publicité optionnelle pour garder ce site gratuit. Voir notre",
    privacyPolicy: "Politique de confidentialité",
    cookieSettings: "Paramètres des cookies",
    essentialOnly: "Essentiels seulement",
    accept: "Tout accepter",
  },
};

export const fr = patchMessages(landingFr, frCore);
