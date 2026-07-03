import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { osmBrands, osmPlaces } from './data/curitiba-osm-places'

type Row = { placeId: string; weekday: number; opensAt: string; closesAt: string }
type DaySchedule = { opensAt: string; closesAt: string } | null

const SCHEDULES: Record<string, DaySchedule[]> = {
  pub: [
    null,
    { opensAt: '17:00:00', closesAt: '23:59:00' },
    { opensAt: '17:00:00', closesAt: '23:59:00' },
    { opensAt: '17:00:00', closesAt: '23:59:00' },
    { opensAt: '17:00:00', closesAt: '23:59:00' },
    { opensAt: '17:00:00', closesAt: '23:59:00' },
    { opensAt: '12:00:00', closesAt: '23:59:00' }
  ],
  bar: [
    null,
    null,
    { opensAt: '18:00:00', closesAt: '23:59:00' },
    { opensAt: '18:00:00', closesAt: '23:59:00' },
    { opensAt: '18:00:00', closesAt: '23:59:00' },
    { opensAt: '18:00:00', closesAt: '23:59:00' },
    { opensAt: '18:00:00', closesAt: '23:59:00' }
  ],
  nightclub: [
    null,
    null,
    null,
    null,
    { opensAt: '22:00:00', closesAt: '23:59:00' },
    { opensAt: '22:00:00', closesAt: '23:59:00' },
    { opensAt: '22:00:00', closesAt: '23:59:00' }
  ]
}

function formatOutput(rows: Row[]): string {
  const lines = rows.map(
    (r) =>
      `  { placeId: '${r.placeId}', weekday: ${r.weekday}, opensAt: '${r.opensAt}', closesAt: '${r.closesAt}' }`
  )
  return `export const osmPlaceOpeningHours = [\n${lines.join(',\n')}\n]\n`
}

function main() {
  const brandById = new Map(osmBrands.map((b) => [b.id, b]))
  const allRows: Row[] = []
  const stats = new Map<string, number>()
  let skipped = 0

  for (const place of osmPlaces) {
    const brand = brandById.get(place.brandId)
    const type = brand?.type
    const schedule = type ? SCHEDULES[type] : undefined
    if (!schedule) {
      skipped++
      continue
    }
    stats.set(type!, (stats.get(type!) ?? 0) + 1)

    for (let weekday = 0; weekday < 7; weekday++) {
      const day = schedule[weekday]
      if (!day) continue
      allRows.push({ placeId: place.id, weekday, opensAt: day.opensAt, closesAt: day.closesAt })
    }
  }

  const outPath = join(import.meta.dir, 'data', 'curitiba-osm-opening-hours.ts')
  writeFileSync(outPath, formatOutput(allRows))

  console.log('--- summary ---')
  console.log(`total places:      ${osmPlaces.length}`)
  for (const [type, count] of stats) console.log(`  ${type.padEnd(10)} ${count}`)
  console.log(`skipped (no type): ${skipped}`)
  console.log(`rows written:      ${allRows.length}`)
  console.log(`output:            ${outPath}`)
}

main()
