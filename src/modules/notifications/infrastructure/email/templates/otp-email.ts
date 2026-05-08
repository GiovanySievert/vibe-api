type OtpEmailConfig = {
  title: string
  description: string
  subject: string
}

const configs: Record<'verification' | 'sign-in' | 'password-reset', OtpEmailConfig> = {
  'verification': {
    subject: 'confirme seu email',
    title: 'confirme seu email',
    description: 'use o código abaixo para verificar seu endereço de email.'
  },
  'sign-in': {
    subject: 'seu código de acesso',
    title: 'código de acesso',
    description: 'use o código abaixo para entrar na sua conta.'
  },
  'password-reset': {
    subject: 'redefinição de senha',
    title: 'redefinir senha',
    description: 'use o código abaixo para redefinir sua senha.'
  }
}

function buildHtml(config: OtpEmailConfig, otp: string): string {
  const formattedOtp = otp.slice(0, 3) + ' ' + otp.slice(3)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#111111">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#1A1A1A;border-radius:12px;padding:40px 36px;">

              <!-- Logo -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:24px;">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#EDEAE4;letter-spacing:-0.5px;">vibes</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:28px;">
                    <div style="height:2px;background-color:#6FE8A8;border-radius:1px;"></div>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:8px;">
                    <span style="font-size:20px;font-weight:600;color:#EDEAE4;">${config.title}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:28px;">
                    <span style="font-size:14px;color:#8a8680;line-height:1.5;">${config.description}</span>
                  </td>
                </tr>
              </table>

              <!-- OTP Code -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="display:inline-block;background-color:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px 32px;">
                      <span style="font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:700;color:#6FE8A8;letter-spacing:6px;">${formattedOtp}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:6px;">
                    <span style="font-size:13px;color:#8a8680;">válido por 10 minutos.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:28px;">
                    <span style="font-size:13px;color:#8a8680;">se não foi você, ignore este email.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:0;">
                    <div style="height:1px;background-color:rgba(255,255,255,0.08);"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;">
                    <span style="font-size:12px;color:#55524d;">vibes &middot; não responda este email</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function verificationEmail(otp: string): { subject: string; html: string } {
  const config = configs['verification']
  return { subject: config.subject, html: buildHtml(config, otp) }
}

export function signInEmail(otp: string): { subject: string; html: string } {
  const config = configs['sign-in']
  return { subject: config.subject, html: buildHtml(config, otp) }
}

export function passwordResetEmail(otp: string): { subject: string; html: string } {
  const config = configs['password-reset']
  return { subject: config.subject, html: buildHtml(config, otp) }
}
