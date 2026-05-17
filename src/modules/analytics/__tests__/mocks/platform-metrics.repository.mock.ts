import {
  ContentMetrics,
  GrowthMetrics,
  MetricsPeriod,
  PlatformMetricsRepository,
  SupportMetrics,
  TrustSafetyMetrics
} from '../../domain/repositories'

const base = (period: MetricsPeriod) => ({
  generatedAt: '2026-01-01T00:00:00.000Z',
  source: 'analytics' as const,
  period
})

export class MockPlatformMetricsRepository implements PlatformMetricsRepository {
  public growthPeriods: MetricsPeriod[] = []
  public contentPeriods: MetricsPeriod[] = []
  public trustSafetyPeriods: MetricsPeriod[] = []
  public supportPeriods: MetricsPeriod[] = []

  async getGrowth(period: MetricsPeriod): Promise<GrowthMetrics> {
    this.growthPeriods.push(period)
    return {
      ...base(period),
      users: {
        total: 10,
        verified: 8,
        banned: 1,
        newInPeriod: 2
      }
    }
  }

  async getContent(period: MetricsPeriod): Promise<ContentMetrics> {
    this.contentPeriods.push(period)
    return {
      ...base(period),
      places: {
        total: 20,
        published: 15,
        pending: 5,
        newInPeriod: 3
      },
      reviews: {
        total: 30,
        newInPeriod: 4
      },
      events: {
        total: 6,
        upcoming: 2,
        newInPeriod: 1
      }
    }
  }

  async getTrustSafety(period: MetricsPeriod): Promise<TrustSafetyMetrics> {
    this.trustSafetyPeriods.push(period)
    return {
      ...base(period),
      users: {
        banned: 1
      },
      reports: {
        total: 5,
        newInPeriod: 2
      }
    }
  }

  async getSupport(period: MetricsPeriod): Promise<SupportMetrics> {
    this.supportPeriods.push(period)
    return {
      ...base(period),
      contactMessages: {
        total: 7,
        newInPeriod: 3
      }
    }
  }
}
