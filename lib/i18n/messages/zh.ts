import type { MessageTree } from "@/lib/i18n/types";
import { landingZh } from "@/lib/i18n/messages/landing-zh";
import { patchMessages } from "@/lib/i18n/merge-messages";

const zhCore: MessageTree = {
  nav: {
    dashboard: "仪表板",
    createInvoice: "创建发票",
    invoiceHistory: "发票历史",
    customers: "客户",
    settings: "设置",
    features: "功能",
    pricing: "定价",
    signIn: "登录",
    signUp: "注册",
    getStarted: "免费开始",
  },
  locale: {
    chooseCountry: "国家和语言",
    searchCountries: "搜索国家…",
    languageLabel: "语言",
  },
  userMenu: {
    settings: "设置",
    support: "提交请求",
    signOut: "退出登录",
  },
  dashboard: {
    title: "仪表板",
    subtitle: "发票概览",
    newInvoice: "新建发票",
    totalInvoices: "发票总数",
    paid: "已付款",
    pending: "待付款",
    revenue: "收入",
  },
  settings: { title: "设置", save: "保存设置" },
  customers: { title: "客户", search: "搜索客户…" },
  cookie: {
    title: "我们使用 Cookie 以保持本网站免费",
    intro:
      "{name} 是面向自由职业者的免费发票工具。Cookie 帮助我们运行应用、了解使用情况，并在您同意时展示广告以分担托管和开发成本。",
    pointEssential:
      "必要 Cookie 用于登录、安全和语言偏好，始终启用。",
    pointAnalytics:
      "分析 Cookie（Google Analytics）收集匿名访问数据以改进产品。",
    pointAds:
      "广告 Cookie（Google AdSense）在您接受后可能展示相关广告，有助于保持发票功能免费。",
    pointData:
      "我们不会使用 Cookie 读取您账户中的发票、客户或付款详情。",
    privacyLead: "阅读我们的",
    privacyPolicy: "隐私政策",
    cookieSettings: "Cookie 设置",
    essentialOnly: "必要与分析",
    essentialHint: "无个性化广告",
    accept: "接受所有 Cookie",
    acceptHint: "广告 + 分析 · 支持免费使用",
  },
};

export const zh = patchMessages(landingZh, zhCore);
