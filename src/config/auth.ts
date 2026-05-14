import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { db } from '@src/infra/database/client'
import { emailOTP } from 'better-auth/plugins'
import { ResendEmailSender } from '@src/modules/notifications/infrastructure/email/resend-email-sender'
import { verificationEmail, signInEmail, passwordResetEmail } from '@src/modules/notifications/infrastructure/email/templates/otp-email'
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
  trustedOrigins: env.TRUSTED_ORIGINS,
  advanced: {
    useSecureCookies: env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false
    },
    database: {
      generateId: false
    }
  },
  plugins: [
    expo(),
    openAPI(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        switch (type) {
          case EMAIL_TYPE.EMAIL_VERIFICATION: {
            const { subject, html } = verificationEmail(otp)
            await emailSender.send(email, subject, html)
            break
          }
          case EMAIL_TYPE.SIGN_IN: {
            const { subject, html } = signInEmail(otp)
            await emailSender.send(email, subject, html)
            break
          }
          case EMAIL_TYPE.PASSWORD_RESET: {
            const { subject, html } = passwordResetEmail(otp)
            await emailSender.send(email, subject, html)
            break
          }
        }
      }
    })
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true
  }),
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
      },
      bio: {
        type: 'string',
        required: false,
        returned: true
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
