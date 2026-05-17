import { MetricsPeriod, PlatformMetricsRepository, SupportMetrics } from '../../domain/repositories'

export class GetSupportMetrics {
  constructor(private readonly platformMetricsRepository: PlatformMetricsRepository) {}

  async execute(period: MetricsPeriod): Promise<SupportMetrics> {
    return await this.platformMetricsRepository.getSupport(period)
  }
}
