type AnonymizableRow = {
  userId: string | null
  isAnonymous: boolean
  user: {
    id: string
    username: string
    image: string | null
    imageThumbnail: string | null
  } | null
}

export function applyAnonymity<T extends AnonymizableRow>(rows: T[], viewerId: string): T[] {
  if (rows.length === 0) return rows

  return rows.map((row) => {
    if (!row.isAnonymous) {
      return { ...row, isAnonymous: false, isOwnAnonymous: false }
    }
    const isOwnAnonymous = row.userId === viewerId
    return { ...row, userId: null, user: null, isAnonymous: true, isOwnAnonymous }
  })
}
