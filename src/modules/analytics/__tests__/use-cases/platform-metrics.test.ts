import { beforeEach, describe, expect, it } from 'bun:test'
import { GetContentMetrics, GetGrowthMetrics, GetSupportMetrics, GetTrustSafetyMetrics } from '../../application/use-cases'
import { MockPlatformMetricsRepository } from '../mocks/platform-metrics.repository.mock'

describe('Platform metrics use cases', () => {
  let repository: MockPlatformMetricsRepository

  beforeEach(() => {
    repository = new MockPlatformMetricsRepository()
  })

  it('forwards period to growth metrics repository', async () => {
    const useCase = new GetGrowthMetrics(repository)

    const result = await useCase.execute('day')

    expect(repository.growthPeriods).toEqual(['day'])
    expect(result.period).toBe('day')
  })

  it('forwards period to content metrics repository', async () => {
    const useCase = new GetContentMetrics(repository)

    const result = await useCase.execute('week')

    expect(repository.contentPeriods).toEqual(['week'])
    expect(result.period).toBe('week')
  })

  it('forwards period to trust and safety metrics repository', async () => {
    const useCase = new GetTrustSafetyMetrics(repository)

    const result = await useCase.execute('day')

    expect(repository.trustSafetyPeriods).toEqual(['day'])
    expect(result.period).toBe('day')
  })

  it('forwards period to support metrics repository', async () => {
    const useCase = new GetSupportMetrics(repository)

    const result = await useCase.execute('week')

    expect(repository.supportPeriods).toEqual(['week'])
    expect(result.period).toBe('week')
  })
})
