import type { MessageTree } from "@/lib/i18n/types";
import { landingPt } from "@/lib/i18n/messages/landing-pt";
import { patchMessages } from "@/lib/i18n/merge-messages";

const ptCore: MessageTree = {
  nav: {
    dashboard: "Painel",
    createInvoice: "Criar fatura",
    invoiceHistory: "Histórico",
    customers: "Clientes",
    settings: "Configurações",
    features: "Recursos",
    pricing: "Preços",
    signIn: "Entrar",
    signUp: "Cadastrar",
    getStarted: "Começar grátis",
  },
  locale: {
    chooseCountry: "País e idioma",
    searchCountries: "Buscar países…",
    languageLabel: "Idioma",
    noCountries: "Nenhum país encontrado",
    commonCountries: "Países comuns. Busque por mais",
  },
  userMenu: {
    settings: "Configurações",
    support: "Pedir ajuda",
    signOut: "Sair",
  },
  sidebar: { privacy: "Privacidade" },
  mobileNav: { create: "Criar", history: "Histórico" },
  dashboard: {
    title: "Painel",
    subtitle: "Visão geral das suas faturas",
    newInvoice: "Nova fatura",
    viewAll: "Ver tudo",
    recentInvoices: "Faturas recentes",
    totalInvoices: "Total de faturas",
    paid: "Pagas",
    pending: "Pendentes",
    revenue: "Receita",
    emptyTitle: "Nenhuma fatura ainda",
    emptyDescription: "Crie sua primeira fatura para começar.",
  },
  settings: {
    title: "Configurações",
    subtitle: "Detalhes padrão para novas faturas",
    save: "Salvar configurações",
    saving: "Salvando…",
    saved: "Configurações salvas",
  },
  customers: {
    title: "Clientes",
    subtitle: "Ver clientes salvos, faturas e baixar extratos.",
    createInvoice: "Criar fatura",
    search: "Buscar clientes…",
  },
  support: {
    title: "Suporte",
    subtitle: "Sua solicitação será enviada ao nosso e-mail de suporte.",
  },
  cookie: {
    message:
      "Usamos cookies de análise e publicidade opcional para manter este site gratuito. Veja a nossa",
    privacyPolicy: "Política de privacidade",
    cookieSettings: "Definições de cookies",
    essentialOnly: "Só essenciais",
    accept: "Aceitar tudo",
  },
};

export const pt = patchMessages(landingPt, ptCore);
