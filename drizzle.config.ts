import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: ['./src/modules/**/application/*.schema.ts'],
  out: './src/infra/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: Bun.env.DATABASE_URL!
  },
  casing: 'snake_case'
})
