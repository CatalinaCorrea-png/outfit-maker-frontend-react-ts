// Guardamos las claves de los mensajes de errores para que se traduzcan
export type ValidationKey =
  | "validation.emailRequired"
  | "validation.emailInvalid"
  | "validation.passwordRequired"
  | "validation.nameRequired"
  | "validation.categoryRequired"
  | "validation.primaryColorRequired"
  | "validation.primaryColorInvalid"
  | "validation.secondaryColorInvalid"
  | "validation.formalityRequired"
  | "validation.formalityRange"
  | "validation.patternInvalid"
  | "validation.fitInvalid"
  | "validation.seasonInvalid"
  // Genérica: sirve para cualquier campo de texto, recibe {{max}}
  | "validation.tooLong"

// Valores a interpolar en el mensaje, ej: { max: 255 } para "Máximo {{max}} caracteres"
export type ValidationParams = Record<string, string | number>

export class ValidationMessage {
  field: string
  message: ValidationKey
  params?: ValidationParams

  constructor(field: string, message: ValidationKey, params?: ValidationParams) {
    this.field = field
    this.message = message
    this.params = params
  }
}
