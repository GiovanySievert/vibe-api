import { GrowthMetrics, MetricsPeriod, PlatformMetricsRepository } from '../../domain/repositories'

export class GetGrowthMetrics {
  constructor(private readonly platformMetricsRepository: PlatformMetricsRepository) {}

  async execute(period: MetricsPeriod): Promise<GrowthMetrics> {
    return await this.platformMetricsRepository.getGrowth(period)
  }
}
