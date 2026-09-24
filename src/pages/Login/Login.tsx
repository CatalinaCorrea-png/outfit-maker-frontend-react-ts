import { useState } from "react"
import { User } from "../../domain/User"
import { useTranslation } from "react-i18next"
import type { ValidationMessage } from "../../components/ValidationField/ValidationMessage"
import { showToast } from "../../utils/toast"
import { useSignIn } from "../../hooks/useSignIn"
import FormField from "../../components/FormField/FormField"
import KeyButton from "../../components/KeyButton/KeyButton"
import AuthLayout from "../../components/AuthLayout/AuthLayout"


const Login = () => {
	const signIn = useSignIn()
	const { t } = useTranslation("auth")
	const [user, setUser] = useState({ email: "", password: "" })
	const [errors, setErrors] = useState<ValidationMessage[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isSubmitting) return

		const userLogin = new User(user.email, user.password)
		userLogin.validateLogin()
		if (userLogin.errors.length > 0) {
			setErrors(userLogin.errors)
			return
		}

		setIsSubmitting(true)
		try {
			await signIn(userLogin.email, userLogin.password)
		} catch (error) {
			showToast.httpError(error, t("loginError"))
		} finally {
			setIsSubmitting(false)
		}
	}

  return (
	<AuthLayout
		subtitle={t("subtitle")}
		sticker="as if! ♡"
		footer={t("footer")}
		switchPrompt={t("noAccount")}
		switchLinkText={t("createOne")}
		switchTo="/register"
	>
		<form onSubmit={handleSubmit} className="form-stack" noValidate>
			<FormField
				id="email"
				type="email"
				label={t("emailLabel")}
				placeholder={t("emailPlaceholder")}
				autoComplete="email"
				value={user.email}
				onChange={(e) => setUser({ ...user, email: e.target.value })}
				errors={errors}
			/>

			<FormField
				id="password"
				type="password"
				label={t("passwordLabel")}
				placeholder={t("passwordPlaceholder")}
				autoComplete="current-password"
				value={user.password}
				onChange={(e) => setUser({ ...user, password: e.target.value })}
				errors={errors}
			/>

			<div className="form-actions">
				<KeyButton type="submit" text={t("submit")} disabled={isSubmitting} />
			</div>
		</form>
	</AuthLayout>
  )
}

export default Login
