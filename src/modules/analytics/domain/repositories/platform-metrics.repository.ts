export type MetricsPeriod = 'day' | 'week'

export type PlatformMetricsBase = {
  generatedAt: string
  source: 'analytics' | 'primary'
  period: MetricsPeriod
}

export type GrowthMetrics = PlatformMetricsBase & {
  users: {
    total: number
    verified: number
    banned: number
    newInPeriod: number
  }
}

export type ContentMetrics = PlatformMetricsBase & {
  places: {
    total: number
    published: number
    pending: number
    newInPeriod: number
  }
  reviews: {
    total: number
    newInPeriod: number
  }
  events: {
    total: number
    upcoming: number
    newInPeriod: number
  }
}

export type TrustSafetyMetrics = PlatformMetricsBase & {
  users: {
    banned: number
  }
  reports: {
    total: number
    newInPeriod: number
  }
}

export type SupportMetrics = PlatformMetricsBase & {
  contactMessages: {
    total: number
    newInPeriod: number
  }
}

export interface PlatformMetricsRepository {
  getGrowth(period: MetricsPeriod): Promise<GrowthMetrics>
  getContent(period: MetricsPeriod): Promise<ContentMetrics>
  getTrustSafety(period: MetricsPeriod): Promise<TrustSafetyMetrics>
  getSupport(period: MetricsPeriod): Promise<SupportMetrics>
}
