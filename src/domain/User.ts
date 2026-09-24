import { ValidationMessage } from "../components/ValidationField/ValidationMessage"
import type { ValidationKey, ValidationParams } from "../components/ValidationField/ValidationMessage"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8

export class User {
	errors: ValidationMessage[] = []

	public email: string = "".trim()
	public password: string = "".trim()
	public displayName: string = "".trim()
	public avatarUrl: string = "".trim()

	constructor(email: string = "", password: string = "", displayName: string = "", avatarUrl: string = "") {
		this.email = email.trim()
		this.password = password
		this.displayName = displayName.trim()
		this.avatarUrl = avatarUrl.trim()
	}

	addError(field: string, message: ValidationKey, params?: ValidationParams) {
    this.errors.push(new ValidationMessage(field, message, params))
  }
    
  private validateEmail() {
    if (!this.email) {
      this.addError("email", "validation.emailRequired")
    } else if (!EMAIL_REGEX.test(this.email)) {
      this.addError("email", "validation.emailInvalid")
    }
  }

  validateLogin() {
    this.errors = []
    this.validateEmail()
    if (!this.password) {
      this.addError("password", "validation.passwordRequired")
    }
    return this.errors
  }

  validateRegister(confirmPassword: string) {
    this.errors = []

    if (!this.displayName) {
      this.addError("name", "validation.nameRequired")
    }

    this.validateEmail()

    if (!this.password) {
      this.addError("password", "validation.passwordRequired")
    } else if (this.password.length < PASSWORD_MIN_LENGTH) {
      this.addError("password", "validation.passwordTooShort", { min: PASSWORD_MIN_LENGTH })
    }

    if (this.password && confirmPassword !== this.password) {
      this.addError("confirmPassword", "validation.passwordMismatch")
    }

    return this.errors
  }
}