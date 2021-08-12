import { ParseMailDto } from './parse-mail.dto'

class MailContact {
  name!: string
  email!: string
}

export class SendMailDto {
  to!: MailContact
  from?: MailContact
  subject!: string
  templateData!: ParseMailDto
}
