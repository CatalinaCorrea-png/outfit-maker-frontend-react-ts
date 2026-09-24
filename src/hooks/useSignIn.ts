import { useNavigate } from "react-router"
import { useAuth, type AuthUser } from "../context/AuthContext"
import { userService } from "../services/userService"

/* Iniciar sesión de punta a punta: pedir los tokens, guardar la sesión y
   entrar al placard. Lo usan el login y el registro (que entra solo después
   de crear la cuenta). Si el back rechaza las credenciales, tira el error
   de axios para que cada pantalla lo muestre como quiera. */
export const useSignIn = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  return async (email: string, password: string) => {
    const userLogged = await userService.login(email, password)

    const userData: Omit<AuthUser, "accessToken"> = {
      id: userLogged.id,
      name: userLogged.name,
      refreshToken: userLogged.refreshToken,
      sessionExpiresAt: 0,
    }
    login(userData, userLogged.accessToken, userLogged.expirationTime, true)
    navigate("/garments")
  }
}
