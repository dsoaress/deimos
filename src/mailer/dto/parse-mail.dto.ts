class TemplateVariables {
  [key: string]: string | number
}

export class ParseMailDto {
  template!: string
  variables!: TemplateVariables
}
