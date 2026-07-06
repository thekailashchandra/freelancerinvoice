export type TrendPoint = {
  date: string;
  count: number;
};

export type CountryCount = {
  countryCode: string;
  count: number;
};

export type PlatformStats = {
  totalUsers: number;
  totalInvoices: number;
  totalClients: number;
  invoicesPaid: number;
  invoicesPending: number;
  invoicesDraft: number;
  pdfDownloads: number;
  receiptDownloads: number;
  paymentsPaidCount: number;
  paymentsTotalInr: number;
  signupsLast7Days: number;
  signupsLast30Days: number;
  invoicesLast7Days: number;
  activeUsersLast30Days: number;
  invoiceTrend: TrendPoint[];
  signupTrend: TrendPoint[];
  topCountries: CountryCount[];
};

export type AdminUserRow = {
  id: string;
  email: string | null;
  companyName: string | null;
  countryCode: string;
  createdAt: string;
  invoiceCount: number;
  clientCount: number;
  lastActiveAt: string | null;
};

export type AdminInvoiceRow = {
  id: string;
  invoiceNumber: string;
  status: string;
  currencyCode: string;
  userId: string;
  userEmail: string | null;
  companyName: string | null;
  clientName: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityLogRow = {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type UmamiStats = {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
};

export type UmamiPageviewPoint = {
  x: string;
  y: number;
};

export type ExternalAnalytics = {
  umami: {
    configured: boolean;
    stats: UmamiStats | null;
    pageviews: UmamiPageviewPoint[];
    dashboardUrl: string | null;
  };
  ga4: {
    configured: boolean;
    measurementId: string | null;
    dashboardUrl: string | null;
  };
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
