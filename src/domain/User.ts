import { ValidationMessage } from "../components/ValidationField/ValidationMessage"
import type { ValidationKey, ValidationParams } from "../components/ValidationField/ValidationMessage"

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
    
  validateLogin() {
    this.errors = []

    if (!this.email?.trim()) {
      this.addError("email", "validation.emailRequired")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.addError("email", "validation.emailInvalid")
      }
    }

    if (!this.password) {
      this.addError("password", "validation.passwordRequired")
    }

    return this.errors
  }
}