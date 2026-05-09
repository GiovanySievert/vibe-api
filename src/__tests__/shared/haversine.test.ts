import { describe, expect, it } from 'bun:test'

import { haversineMeters } from '@src/shared/utils/haversine'

describe('haversineMeters', () => {
  it('returns 0 for the same point', () => {
    expect(haversineMeters({ lat: 0, lng: 0 }, { lat: 0, lng: 0 })).toBe(0)
  })

  it('matches a known short distance (~111m for 0.001 degree of latitude near equator)', () => {
    const distance = haversineMeters({ lat: 0, lng: 0 }, { lat: 0.001, lng: 0 })
    expect(distance).toBeGreaterThan(110)
    expect(distance).toBeLessThan(112)
  })

  it('matches a known medium distance (~157km between two POA neighborhoods is too far)', () => {
    const moinhos = { lat: -30.0277, lng: -51.205 }
    const cidadeBaixa = { lat: -30.0431, lng: -51.2194 }
    const distance = haversineMeters(moinhos, cidadeBaixa)
    expect(distance).toBeGreaterThan(1800)
    expect(distance).toBeLessThan(2400)
  })

  it('is symmetric', () => {
    const a = { lat: -23.55, lng: -46.63 }
    const b = { lat: -22.9, lng: -43.21 }
    expect(haversineMeters(a, b)).toBeCloseTo(haversineMeters(b, a), 5)
  })
})
