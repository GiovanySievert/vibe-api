import { ContentMetrics, MetricsPeriod, PlatformMetricsRepository } from '../../domain/repositories'

export class GetContentMetrics {
  constructor(private readonly platformMetricsRepository: PlatformMetricsRepository) {}

  async execute(period: MetricsPeriod): Promise<ContentMetrics> {
    return await this.platformMetricsRepository.getContent(period)
  }
}
