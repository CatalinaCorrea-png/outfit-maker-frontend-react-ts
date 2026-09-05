// Guardamos las claves de los mensajes de errores para que se traduzcan
export type ValidationKey =
  | "validation.emailRequired"
  | "validation.emailInvalid"
  | "validation.passwordRequired"

export class ValidationMessage {
  field: string
  message: ValidationKey

  constructor(field: string, message: ValidationKey) {
    this.field = field
    this.message = message
  }
}
