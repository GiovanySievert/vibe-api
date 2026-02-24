import { Elysia, t } from 'elysia'
import { BrandsModule } from '../../../brands.module'
import { validateCreateAllEntities } from '../dtos'

export const brandsRoutes = (app: Elysia) => {
  const { controller } = new BrandsModule()

  return app.group('/brands', (app) =>
    app
      .post('/', (ctx) => controller.create(ctx), {
        body: validateCreateAllEntities,
        detail: {
          tags: ['Brands'],
          summary: 'Create a new brand with place and location',
          description: 'Creates a complete brand entity including place and location data'
        }
      })
      .get('/:brandId', (ctx) => controller.getById(ctx), {
        params: t.Object({
          brandId: t.String()
        }),
        detail: {
          tags: ['Brands'],
          summary: 'Get brand by ID',
          description: 'Get brand by ID'
        }
      })
      .post('/places/reindex', () => controller.reindexPlaces(), {
        detail: {
          tags: ['Brands'],
          summary: 'Start reindex job for all places',
          description:
            'Starts a background job that fetches all places in batches of 100 and publishes them to the Elasticsearch queue. Returns immediately with a job ID for tracking progress.'
        }
      })
      .get('/places/reindex/:jobId', (ctx) => controller.getReindexStatus(ctx), {
        params: t.Object({
          jobId: t.String()
        }),
        detail: {
          tags: ['Brands'],
          summary: 'Get reindex job status',
          description: 'Returns the current status and progress of a reindex job'
        }
      })
  )
}
