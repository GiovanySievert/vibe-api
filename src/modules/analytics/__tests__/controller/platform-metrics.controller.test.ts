import { beforeEach, describe, expect, it } from 'bun:test'
import { GetContentMetrics, GetGrowthMetrics, GetSupportMetrics, GetTrustSafetyMetrics } from '../../application/use-cases'
import { PlatformMetricsController } from '../../infrastructure/http/controllers'
import { MockPlatformMetricsRepository } from '../mocks/platform-metrics.repository.mock'

describe('PlatformMetricsController', () => {
  let repository: MockPlatformMetricsRepository
  let controller: PlatformMetricsController

  beforeEach(() => {
    repository = new MockPlatformMetricsRepository()
    controller = new PlatformMetricsController(
      new GetGrowthMetrics(repository),
      new GetContentMetrics(repository),
      new GetTrustSafetyMetrics(repository),
      new GetSupportMetrics(repository)
    )
  })

  it('defaults missing period to week', async () => {
    const result = await controller.growth({ query: {} })

    expect(result.period).toBe('week')
    expect(repository.growthPeriods).toEqual(['week'])
  })

  it('accepts explicit day period', async () => {
    const result = await controller.content({ query: { period: 'day' } })

    expect(result.period).toBe('day')
    expect(repository.contentPeriods).toEqual(['day'])
  })

  it('accepts explicit week period', async () => {
    const result = await controller.support({ query: { period: 'week' } })

    expect(result.period).toBe('week')
    expect(repository.supportPeriods).toEqual(['week'])
  })
})
