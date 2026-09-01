import { useState } from "react"
import { useAuth, type AuthUser } from "../context/AuthContext"
import { User } from "../domain/User"
import { userService } from "../services/userService"
import { useNavigate } from "react-router"
import type { ValidationMessage } from "../components/ValidationField/ValidationMessage"
import { showToast } from "../utils/toast"
import ValidationField from "../components/ValidationField/ValidationField"


const Login = () => {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [user, setUser] = useState({ email: "", password: "" })
	const [errors, setErrors] = useState<ValidationMessage[]>([])

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const userLogin = new User(user.email, user.password)
		console.log("Validando usuario:", userLogin)
		userLogin.validateLogin()
		if (userLogin.errors.length > 0) {
			console.log("Errores de validación:", userLogin.errors)
			setErrors(userLogin.errors)
			return
		}

		try {
			const userLogged = await userService.login(userLogin.email, userLogin.password)

			if (userLogged) {
				console.log("Usuario logueado:", userLogged)
				const userData : Omit<AuthUser, 'accessToken'> = {
					id: userLogged.id,
					refreshToken: userLogged.refreshToken,
					sessionExpiresAt: 0
				}
				login(userData, userLogged.accessToken, userLogged.expirationTime, true)
				navigate("/")
			}
		} catch (error) {
			showToast.httpError(error, "Error al iniciar sesión")
		}
	}

  return (
    <form onSubmit={handleSubmit}>
			<div className="input">
				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					value={user.email}
					onChange={(e) => setUser({ ...user, email: e.target.value })}
				/>
				<ValidationField field="email" errors={errors} />
			</div>

			<div className="input">
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					value={user.password}
					onChange={(e) => setUser({ ...user, password: e.target.value })}
				/>
				<ValidationField field="password" errors={errors} />
			</div>
			<button type="submit">Login</button>
		</form>
  )
}

export default Login