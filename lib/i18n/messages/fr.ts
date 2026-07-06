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
    title: "Nous utilisons des cookies pour garder ce site gratuit",
    intro:
      "{name} est un outil de facturation gratuit pour les freelances. Les cookies nous aident à faire fonctionner l'application, comprendre son utilisation et — si vous acceptez — afficher des publicités qui contribuent à l'hébergement et au développement.",
    pointEssential:
      "Les cookies essentiels gèrent la connexion, la sécurité et votre langue. Ils sont toujours actifs.",
    pointAnalytics:
      "Les cookies d'analyse (Google Analytics) collectent des statistiques anonymes pour améliorer le produit.",
    pointAds:
      "Les cookies publicitaires (Google AdSense) peuvent afficher des annonces pertinentes si vous acceptez — cela aide à garder la facturation gratuite.",
    pointData:
      "Nous n'utilisons pas de cookies pour lire les factures, clients ou données de paiement de votre compte.",
    privacyLead: "Consultez notre",
    privacyPolicy: "Politique de confidentialité",
    cookieSettings: "Paramètres des cookies",
    essentialOnly: "Essentiels et analyse",
    essentialHint: "Pas de publicités personnalisées",
    accept: "Accepter tous les cookies",
    acceptHint: "Publicités + analyse · soutient l'accès gratuit",
  },
};

export const fr = patchMessages(landingFr, frCore);
