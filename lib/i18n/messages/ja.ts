import type { MessageTree } from "@/lib/i18n/types";
import { landingJa } from "@/lib/i18n/messages/landing-ja";
import { patchMessages } from "@/lib/i18n/merge-messages";

const jaCore: MessageTree = {
  nav: {
    dashboard: "ダッシュボード",
    createInvoice: "請求書を作成",
    invoiceHistory: "請求履歴",
    customers: "顧客",
    settings: "設定",
    features: "機能",
    pricing: "料金",
    signIn: "ログイン",
    signUp: "登録",
    getStarted: "無料で始める",
  },
  locale: {
    chooseCountry: "国と言語",
    searchCountries: "国を検索…",
    languageLabel: "言語",
  },
  userMenu: {
    settings: "設定",
    support: "サポート依頼",
    signOut: "ログアウト",
  },
  dashboard: {
    title: "ダッシュボード",
    subtitle: "請求書の概要",
    newInvoice: "新規請求書",
    totalInvoices: "請求書合計",
    paid: "支払済み",
    pending: "未払い",
    revenue: "売上",
  },
  settings: { title: "設定", save: "設定を保存" },
  customers: { title: "顧客", search: "顧客を検索…" },
  cookie: {
    message:
      "分析と任意の広告のためにCookieを使用し、このサイトを無料で維持しています。詳細は",
    privacyPolicy: "プライバシーポリシー",
    cookieSettings: "Cookie設定",
    essentialOnly: "必須のみ",
    accept: "すべて受け入れる",
  },
};

export const ja = patchMessages(landingJa, jaCore);
