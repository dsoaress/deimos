import FormData from 'form-data'
import Mailgun from 'mailgun.js'

import { mailConfig } from '../config/mail.config'
import { Handlebars } from './handlebars.provider'

interface MailContact {
  name: string
  email: string
}

interface TemplateVariables {
  [key: string]: string | number
}

interface ParseMailTemplate {
  template: string
  variables: TemplateVariables
}

interface SendMail {
  to: MailContact
  from?: MailContact
  subject: string
  templateData: ParseMailTemplate
}

export class MailProvider {
  static async sendMail({ to, from, subject, templateData }: SendMail): Promise<void> {
    const mailgun = new Mailgun(FormData)
    const mailTemplate = new Handlebars()

    const { MAILGUN_API_KEY, MAILGUN_PUBLIC_KEY } = process.env

    if (!MAILGUN_API_KEY) throw new Error('MAILGUN_API_KEY is missing')
    if (!MAILGUN_PUBLIC_KEY) throw new Error('MAILGUN_API_KEY is missing')

    const { email, name } = mailConfig.from

    const html = await mailTemplate.parse(templateData)

    const mg = mailgun.client({
      username: 'api',
      key: MAILGUN_API_KEY,
      public_key: MAILGUN_PUBLIC_KEY
    })

    mg.messages
      .create(mailConfig.sandbox, {
        from: `${from?.name ?? name} <${from?.email ?? email}>`,
        to: [`${to.name} <${to.email}>`],
        subject: subject,
        html
      })
      .catch((e: unknown) => console.error(e))
  }
}
