import { GetContentMetrics, GetGrowthMetrics, GetSupportMetrics, GetTrustSafetyMetrics } from './application/use-cases'
import { PlatformMetricsController } from './infrastructure/http/controllers'
import { DrizzlePlatformMetricsRepository } from './infrastructure/persistence'

export class AnalyticsModule {
  public readonly platformMetricsController: PlatformMetricsController

  constructor() {
    const platformMetricsRepository = new DrizzlePlatformMetricsRepository()
    const getGrowthMetrics = new GetGrowthMetrics(platformMetricsRepository)
    const getContentMetrics = new GetContentMetrics(platformMetricsRepository)
    const getTrustSafetyMetrics = new GetTrustSafetyMetrics(platformMetricsRepository)
    const getSupportMetrics = new GetSupportMetrics(platformMetricsRepository)

    this.platformMetricsController = new PlatformMetricsController(
      getGrowthMetrics,
      getContentMetrics,
      getTrustSafetyMetrics,
      getSupportMetrics
    )
  }
}
