import { Elysia } from 'elysia'
import { auth } from '@src/config/auth'

type AuthUser = {
  id?: string | null
  role?: string | null
  emailVerified?: boolean | null
}

const toBetterAuthAdminRole = (role?: string | null): 'admin' | 'user' =>
  (role ?? '').split(',').some((value) => value.trim() === 'admin') ? 'admin' : 'user'

export const hasAdminAccess = async (user: AuthUser): Promise<boolean> => {
  if (!user.id) return false
  if (user.emailVerified !== true) return false

  const result = await auth.api.userHasPermission({
    body: {
      role: toBetterAuthAdminRole(user.role),
      permissions: {
        user: ['list']
      }
    }
  })

  return result.success
}

export const adminMiddleware = new Elysia({ name: 'admin' }).macro({
  admin: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({ headers })

      if (!session) return status(401)
      if (!(await hasAdminAccess(session.user))) return status(403)

      return {
        user: session.user,
        session: session.session
      }
    }
  }
})
