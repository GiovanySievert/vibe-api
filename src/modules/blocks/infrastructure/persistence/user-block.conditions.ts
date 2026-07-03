import { sql } from 'drizzle-orm'

import { userBlocks } from '../../application/schemas'

export function userBlockExistsBetween(userAId: unknown, userBId: unknown) {
  return sql<boolean>`exists (
    select 1
    from ${userBlocks}
    where (
      (${userBlocks.blockerId} = ${userAId} and ${userBlocks.blockedId} = ${userBId})
      or
      (${userBlocks.blockerId} = ${userBId} and ${userBlocks.blockedId} = ${userAId})
    )
  )`
}

export function noUserBlockBetween(userAId: unknown, userBId: unknown) {
  return sql<boolean>`not ${userBlockExistsBetween(userAId, userBId)}`
}
