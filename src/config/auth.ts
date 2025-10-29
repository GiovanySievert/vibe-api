import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { db } from '@src/infra/database/client'
import { emailOTP } from 'better-auth/plugins'
import { ResendEmailSender } from '@src/modules/notifications/infrastructure/email/resend-email-sender'
import { env } from './env'
import { expo } from '@better-auth/expo'

enum EMAIL_TYPE {
  SIGN_IN = 'sign-in',
  EMAIL_VERIFICATION = 'email-verification',
  PASSWORD_RESET = 'forget-password'
}

const emailSender = new ResendEmailSender(env.RESEND_API_KEY, env.RESEND_FROM_EMAIL)

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: ['myapp://'],
  advanced: {
    useSecureCookies: true
  },
  plugins: [
    expo(),
    openAPI(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        switch (type) {
          case EMAIL_TYPE.EMAIL_VERIFICATION:
            await emailSender.send(email, 'Verify your email', `Your verification code is: ${otp}`)
            break
          case EMAIL_TYPE.SIGN_IN:
            await emailSender.send(email, 'Sign in', `Your sign in code is: ${otp}`)
            break
          case EMAIL_TYPE.PASSWORD_RESET:
            await emailSender.send(email, 'Password reset', `Your password reset code is: ${otp}`)
            break
        }
      }
    })
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      await emailSender.send(user.email, 'Verify your email', `Click: ${url}`)
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    expiresIn: 600
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash)
    }
  },
  user: {
    deleteUser: {
      enabled: true
    },
    additionalFields: {
      username: {
        type: 'string'
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 90,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 10
    }
  }
})
