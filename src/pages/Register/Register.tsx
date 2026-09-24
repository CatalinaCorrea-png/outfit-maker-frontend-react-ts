import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { ValidationMessage } from "../../components/ValidationField/ValidationMessage"
import FormField from "../../components/FormField/FormField"
import KeyButton from "../../components/KeyButton/KeyButton"
import AuthLayout from "../../components/AuthLayout/AuthLayout"
import { User } from "../../domain/User"
import { showToast } from "../../utils/toast"
import { userService } from "../../services/userService"
import { useNavigate } from "react-router"
import { useSignIn } from "../../hooks/useSignIn"

type RegisterForm = {
	name: string
	email: string
	password: string
	confirmPassword: string
}

const emptyForm: RegisterForm = { name: "", email: "", password: "", confirmPassword: "" }

const Register = () => {
	const { t } = useTranslation("auth")
	const [form, setForm] = useState<RegisterForm>(emptyForm)
	const [errors, setErrors] = useState<ValidationMessage[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const navigate = useNavigate()
	const signIn = useSignIn()

	// Un solo handler para todos los campos: la clave dice cuál actualizar
	const handleChange = (key: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
		setForm({ ...form, [key]: e.target.value })

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isSubmitting) return

		const userRegister = new User(form.email, form.password, form.name)
		userRegister.validateRegister(form.confirmPassword)
		if (userRegister.errors.length > 0) {
			setErrors(userRegister.errors)
			return
		}

		setIsSubmitting(true)
		try {
			try {
				await userService.register({
					name: userRegister.displayName,
					email: userRegister.email,
					password: userRegister.password,
				})
			} catch (error) {
				showToast.httpError(error, t("register.error"))
				return
			}

			// La cuenta ya existe: entramos directo, sin volver a pedir los datos
			try {
				await signIn(userRegister.email, userRegister.password)
				showToast.success(t("register.success"))
			} catch {
				// Raro, pero posible: la cuenta se creó y el login automático falló.
				// No es un error para el usuario, solo tiene que entrar a mano.
				showToast.success(t("register.successLogIn"))
				navigate("/login")
			}
		} finally {
			setIsSubmitting(false)
		}
	}

  return (
	<AuthLayout
		subtitle={t("register.subtitle")}
		sticker="new in! ♡"
		footer={t("footer")}
		switchPrompt={t("register.haveAccount")}
		switchLinkText={t("register.logIn")}
		switchTo="/login"
	>
		<form onSubmit={handleSubmit} className="form-stack" noValidate>
			<FormField
				id="name"
				label={t("register.nameLabel")}
				placeholder={t("register.namePlaceholder")}
				autoComplete="name"
				value={form.name}
				onChange={handleChange("name")}
				errors={errors}
			/>

			<FormField
				id="email"
				type="email"
				label={t("emailLabel")}
				placeholder={t("emailPlaceholder")}
				autoComplete="email"
				value={form.email}
				onChange={handleChange("email")}
				errors={errors}
			/>

			<FormField
				id="password"
				type="password"
				label={t("passwordLabel")}
				placeholder={t("register.passwordPlaceholder")}
				autoComplete="new-password"
				value={form.password}
				onChange={handleChange("password")}
				errors={errors}
			/>

			<FormField
				id="confirmPassword"
				type="password"
				label={t("register.confirmPasswordLabel")}
				placeholder={t("register.confirmPasswordPlaceholder")}
				autoComplete="new-password"
				value={form.confirmPassword}
				onChange={handleChange("confirmPassword")}
				errors={errors}
			/>

			<div className="form-actions">
				<KeyButton type="submit" text={t("register.submit")} disabled={isSubmitting} />
			</div>
		</form>
	</AuthLayout>
  )
}

export default Register
