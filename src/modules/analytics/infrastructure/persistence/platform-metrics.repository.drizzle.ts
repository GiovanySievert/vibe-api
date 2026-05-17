import { count, sql } from 'drizzle-orm'
import { env } from '@src/config/env'
import { analyticsDb } from '@src/infra/database/analytics-client'
import { contactMessages, events, placeReviews, places, userReports, users } from '@src/infra/database/schema'
import {
  ContentMetrics,
  GrowthMetrics,
  MetricsPeriod,
  PlatformMetricsBase,
  PlatformMetricsRepository,
  SupportMetrics,
  TrustSafetyMetrics
} from '../../domain/repositories'

export class DrizzlePlatformMetricsRepository implements PlatformMetricsRepository {
  private getBase(period: MetricsPeriod): PlatformMetricsBase {
    return {
      generatedAt: new Date().toISOString(),
      source: env.ANALYTICS_DATABASE_URL ? 'analytics' : 'primary',
      period
    }
  }

  private getPeriodStart(period: MetricsPeriod) {
    return period === 'day' ? sql`now() - interval '24 hours'` : sql`now() - interval '7 days'`
  }

  async getGrowth(period: MetricsPeriod): Promise<GrowthMetrics> {
    const periodStart = this.getPeriodStart(period)
    const [userMetrics] = await analyticsDb
      .select({
        total: count(users.id),
        verified: sql<number>`count(*) filter (where ${users.emailVerified} = true)::int`,
        banned: sql<number>`count(*) filter (where ${users.banned} = true)::int`,
        newInPeriod: sql<number>`count(*) filter (where ${users.createdAt} >= ${periodStart})::int`
      })
      .from(users)

    return {
      ...this.getBase(period),
      users: {
        total: Number(userMetrics?.total ?? 0),
        verified: Number(userMetrics?.verified ?? 0),
        banned: Number(userMetrics?.banned ?? 0),
        newInPeriod: Number(userMetrics?.newInPeriod ?? 0)
      }
    }
  }

  async getContent(period: MetricsPeriod): Promise<ContentMetrics> {
    const periodStart = this.getPeriodStart(period)
    const [placeMetrics] = await analyticsDb
      .select({
        total: count(places.id),
        published: sql<number>`count(*) filter (where ${places.status} in ('active', 'approved', 'published'))::int`,
        pending: sql<number>`count(*) filter (where ${places.status} = 'pending')::int`,
        newInPeriod: sql<number>`count(*) filter (where ${places.createdAt} >= ${periodStart})::int`
      })
      .from(places)

    const [reviewMetrics] = await analyticsDb
      .select({
        total: count(placeReviews.id),
        newInPeriod: sql<number>`count(*) filter (where ${placeReviews.createdAt} >= ${periodStart})::int`
      })
      .from(placeReviews)

    const [eventMetrics] = await analyticsDb
      .select({
        total: count(events.id),
        upcoming: sql<number>`count(*) filter (where ${events.date} >= current_date)::int`,
        newInPeriod: sql<number>`count(*) filter (where ${events.createdAt} >= ${periodStart})::int`
      })
      .from(events)

    return {
      ...this.getBase(period),
      places: {
        total: Number(placeMetrics?.total ?? 0),
        published: Number(placeMetrics?.published ?? 0),
        pending: Number(placeMetrics?.pending ?? 0),
        newInPeriod: Number(placeMetrics?.newInPeriod ?? 0)
      },
      reviews: {
        total: Number(reviewMetrics?.total ?? 0),
        newInPeriod: Number(reviewMetrics?.newInPeriod ?? 0)
      },
      events: {
        total: Number(eventMetrics?.total ?? 0),
        upcoming: Number(eventMetrics?.upcoming ?? 0),
        newInPeriod: Number(eventMetrics?.newInPeriod ?? 0)
      }
    }
  }

  async getTrustSafety(period: MetricsPeriod): Promise<TrustSafetyMetrics> {
    const periodStart = this.getPeriodStart(period)
    const [userMetrics] = await analyticsDb
      .select({
        banned: sql<number>`count(*) filter (where ${users.banned} = true)::int`
      })
      .from(users)

    const [reportMetrics] = await analyticsDb
      .select({
        total: count(userReports.id),
        newInPeriod: sql<number>`count(*) filter (where ${userReports.createdAt} >= ${periodStart})::int`
      })
      .from(userReports)

    return {
      ...this.getBase(period),
      users: {
        banned: Number(userMetrics?.banned ?? 0)
      },
      reports: {
        total: Number(reportMetrics?.total ?? 0),
        newInPeriod: Number(reportMetrics?.newInPeriod ?? 0)
      }
    }
  }

  async getSupport(period: MetricsPeriod): Promise<SupportMetrics> {
    const periodStart = this.getPeriodStart(period)
    const [contactMessageMetrics] = await analyticsDb
      .select({
        total: count(contactMessages.id),
        newInPeriod: sql<number>`count(*) filter (where ${contactMessages.createdAt} >= ${periodStart})::int`
      })
      .from(contactMessages)

    return {
      ...this.getBase(period),
      contactMessages: {
        total: Number(contactMessageMetrics?.total ?? 0),
        newInPeriod: Number(contactMessageMetrics?.newInPeriod ?? 0)
      }
    }
  }
}
