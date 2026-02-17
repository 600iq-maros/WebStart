import { Resend } from "resend"

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendProjectReadyEmail({
  to,
  projectName,
  deploymentUrl,
}: {
  to: string
  projectName: string
  deploymentUrl: string
}) {
  await getResend().emails.send({
    from: "Web Factory <onboarding@resend.dev>",
    to,
    subject: `Your website "${projectName}" is live!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #111; font-size: 24px;">Your website is live!</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Great news — your website <strong>${projectName}</strong> has been generated and deployed successfully.
        </p>
        <a href="${deploymentUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 16px 0;">
          View your website
        </a>
        <p style="color: #888; font-size: 14px; margin-top: 24px;">
          You can make changes to your site using the chat editor in your dashboard.
        </p>
      </div>
    `,
  })
}

export async function sendProjectFailedEmail({
  to,
  projectName,
  errorMessage,
}: {
  to: string
  projectName: string
  errorMessage: string
}) {
  await getResend().emails.send({
    from: "Web Factory <onboarding@resend.dev>",
    to,
    subject: `Website generation failed: "${projectName}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #111; font-size: 24px;">Generation Failed</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Unfortunately, the generation of <strong>${projectName}</strong> encountered an error.
        </p>
        <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 12px; border-radius: 6px; margin: 16px 0;">
          <p style="color: #991B1B; font-size: 14px; font-family: monospace; margin: 0;">
            ${errorMessage}
          </p>
        </div>
        <p style="color: #888; font-size: 14px;">
          You can retry the generation from your dashboard.
        </p>
      </div>
    `,
  })
}
