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
  )
}
