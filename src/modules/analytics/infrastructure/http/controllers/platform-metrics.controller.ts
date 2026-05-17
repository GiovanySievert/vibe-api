import { GetContentMetrics, GetGrowthMetrics, GetSupportMetrics, GetTrustSafetyMetrics } from '../../../application/use-cases'
import { MetricsPeriod } from '../../../domain/repositories'

type MetricsQuery = {
  period?: MetricsPeriod
}

export class PlatformMetricsController {
  constructor(
    private readonly getGrowthMetrics: GetGrowthMetrics,
    private readonly getContentMetrics: GetContentMetrics,
    private readonly getTrustSafetyMetrics: GetTrustSafetyMetrics,
    private readonly getSupportMetrics: GetSupportMetrics
  ) {}

  private getPeriod(query: MetricsQuery): MetricsPeriod {
    return query.period ?? 'week'
  }

  async growth({ query }: { query: MetricsQuery }) {
    return await this.getGrowthMetrics.execute(this.getPeriod(query))
  }

  async content({ query }: { query: MetricsQuery }) {
    return await this.getContentMetrics.execute(this.getPeriod(query))
  }

  async trustSafety({ query }: { query: MetricsQuery }) {
    return await this.getTrustSafetyMetrics.execute(this.getPeriod(query))
  }

  async support({ query }: { query: MetricsQuery }) {
    return await this.getSupportMetrics.execute(this.getPeriod(query))
  }
}
