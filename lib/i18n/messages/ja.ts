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
    title: "このサイトを無料で維持するためにCookieを使用しています",
    intro:
      "{name}はフリーランサー向けの無料請求書ツールです。Cookieはアプリの運用、利用状況の把握、そして同意いただいた場合のホスティングや開発費用のための広告表示に役立ちます。",
    pointEssential:
      "必須Cookieはログイン、セキュリティ、言語設定に使用されます。常に有効です。",
    pointAnalytics:
      "分析Cookie（Google Analytics）は匿名の訪問統計を収集し、製品改善に役立てます。",
    pointAds:
      "広告Cookie（Google AdSense）は同意時に関連広告を表示し、無料提供の維持に役立ちます。",
    pointData:
      "アカウント内の請求書、顧客、支払い情報をCookieで読み取ることはありません。",
    privacyLead: "詳細は",
    privacyPolicy: "プライバシーポリシー",
    cookieSettings: "Cookie設定",
    essentialOnly: "必須と分析のみ",
    essentialHint: "パーソナライズ広告なし",
    accept: "すべてのCookieを受け入れる",
    acceptHint: "広告＋分析 · 無料提供を支援",
  },
};

export const ja = patchMessages(landingJa, jaCore);
