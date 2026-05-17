import { MetricsPeriod, PlatformMetricsRepository, TrustSafetyMetrics } from '../../domain/repositories'

export class GetTrustSafetyMetrics {
  constructor(private readonly platformMetricsRepository: PlatformMetricsRepository) {}

  async execute(period: MetricsPeriod): Promise<TrustSafetyMetrics> {
    return await this.platformMetricsRepository.getTrustSafety(period)
  }
}
