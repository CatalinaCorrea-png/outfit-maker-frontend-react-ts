import { useState } from "react"
import { useAuth, type AuthUser } from "../context/AuthContext"
import { User } from "../domain/User"
import { userService } from "../services/userService"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import type { ValidationMessage } from "../components/ValidationField/ValidationMessage"
import { showToast } from "../utils/toast"
import ValidationField from "../components/ValidationField/ValidationField"
import InputField from "../components/InputField/InputField"
import KeyButton from "../components/KeyButton/KeyButton"
import "./login.css"
import GitHubLink from "../components/GitHubLink/GitHubLink"
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher"


const Login = () => {
	const navigate = useNavigate()
	const { login } = useAuth()
	const { t } = useTranslation("auth")
	const [user, setUser] = useState({ email: "", password: "" })
	const [errors, setErrors] = useState<ValidationMessage[]>([])

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const userLogin = new User(user.email, user.password)
		// console.log("Validando usuario:", userLogin)
		userLogin.validateLogin()
		if (userLogin.errors.length > 0) {
			// console.log("Errores de validación:", userLogin.errors)
			setErrors(userLogin.errors)
			return
		}

		try {
			const userLogged = await userService.login(userLogin.email, userLogin.password)

			if (userLogged) {
				// console.log("Usuario logueado:", userLogged)
				const userData : Omit<AuthUser, 'accessToken'> = {
					id: userLogged.id,
					refreshToken: userLogged.refreshToken,
					sessionExpiresAt: 0
				}
				login(userData, userLogged.accessToken, userLogged.expirationTime, true)
				navigate("/")
			}
		} catch (error) {
			showToast.httpError(error, t("loginError"))
		}
	}

  return (
	<main className="login-screen">
		<div className="login-lang">
			<LanguageSwitcher />
		</div>
		<div className="login-card">
			<div className="login-holes" aria-hidden="true">
				<span />
				<span />
				<span />
			</div>
			<span className="login-tape" aria-hidden="true">★ 2 0 0 0 ★</span>
			<span className="login-sticker" aria-hidden="true">as if! ♡</span>

			<header className="login-header">
				<h1 className="login-title">
					outfit <em>maker</em>
				</h1>
				<p className="login-subtitle">
					{t("subtitle")}
				</p>
			</header>

			<form onSubmit={handleSubmit} className="login-form" noValidate>
				<div className="field">
					<label className="field-label" htmlFor="email">
						{t("emailLabel")}
					</label>
					<InputField
						type="email"
						id="email"
						placeholder={t("emailPlaceholder")}
						value={user.email}
						onChange={(e) => setUser({ ...user, email: e.target.value })}
					/>
					<ValidationField field="email" errors={errors} />
				</div>

				<div className="field">
					<label className="field-label" htmlFor="password">
						{t("passwordLabel")}
					</label>
					<InputField
						type="password"
						id="password"
						placeholder={t("passwordPlaceholder")}
						value={user.password}
						onChange={(e) => setUser({ ...user, password: e.target.value })}
					/>
					<ValidationField field="password" errors={errors} />
				</div>

				<div className="login-actions">
					<KeyButton type="submit" text={t("submit")} />
				</div>
			</form>

			<p className="login-footer">{t("footer")}</p>
		</div>

		<div className="login-aside">
			<GitHubLink />
		</div>
	</main>
  )
}

export default Login