import { Injectable } from '@nestjs/common'
import FormData from 'form-data'
import handlebars from 'handlebars'
import Mailgun from 'mailgun.js'
import { User } from 'src/users/schema/user.schema'

import { mailerConfig } from './constants'
import { ParseMailDto } from './dto/parse-mail.dto'
import { SendMailDto } from './dto/send-mail.dto'
import { verificationEmail } from './templates/verification-email.template'

@Injectable()
export class MailerService {
  async sendMail({ to, from, subject, templateData }: SendMailDto): Promise<void> {
    const mailgun = new Mailgun(FormData)
    const mailTemplate = await this.parse(templateData)

    const { MAILGUN_API_KEY, MAILGUN_PUBLIC_KEY } = process.env

    if (!MAILGUN_API_KEY) throw new Error('MAILGUN_API_KEY is missing')
    if (!MAILGUN_PUBLIC_KEY) throw new Error('MAILGUN_API_KEY is missing')

    const { email, name } = mailerConfig.from

    const mg = mailgun.client({
      username: 'api',
      key: MAILGUN_API_KEY,
      public_key: MAILGUN_PUBLIC_KEY
    })

    mg.messages
      .create(mailerConfig.sandbox, {
        from: `${from?.name ?? name} <${from?.email ?? email}>`,
        to: [`${to.name} <${to.email}>`],
        subject: subject,
        html: mailTemplate
      })
      .catch((e: unknown) => console.error(e))
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const message = {
      to: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      subject: 'Check your email',
      templateData: {
        template: verificationEmail,
        variables: {
          firstName: user.firstName,
          link: `http://localhost:3010/auth/${user._id}/${user.emailVerificationToken.token}`,
          token: user.emailVerificationToken.token
        }
      }
    }

    this.sendMail(message)
  }

  private async parse({ template, variables }: ParseMailDto): Promise<string> {
    const parseTemplate = handlebars.compile(template)

    return parseTemplate(variables)
  }
}