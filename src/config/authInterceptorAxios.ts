import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios"
import { tokenMemory, tokenService } from "../services/tokenService"

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  // Los endpoints de auth (login/register/refresh) NO deben llevar el access token:
  // si quedó uno viejo/expirado, el JwtAuthenticationFilter del back lo rechaza con 401
  // antes de llegar al permitAll, y el login falla. (Mismo criterio que el storageGuard.)
  if (config.url?.includes("/auth")) return config

  const accessToken = tokenMemory.get()
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`
  }
  return config
}

axios.interceptors.request.use(authInterceptor)

const storageGuard = (config: InternalAxiosRequestConfig) => {
  if (config.url?.includes("/auth")) return config // don´t block auth endpoints

  const stored = localStorage.getItem("user") || sessionStorage.getItem("user")
  if (!stored) {
    tokenService.clearTokens()
    // ----- To show a message in the login page ----------------
    // sessionStorage.setItem("invalidSession", "1")
    // ----------------------------------------------------------
    window.location.href = "/login"
    return Promise.reject(new axios.Cancel("No hay sesión activa"))
  }
  return config
}

axios.interceptors.request.use(storageGuard)

type Retryable = AxiosRequestConfig & { _retry?: boolean }

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token)
    else p.reject(error)
  })
  failedQueue = []
}

const isExpiredTokenError = (error: AxiosError): boolean => {
  if (error.response?.status !== 401) return false
  const header = error.response.headers["www-authenticate"]
  return typeof header === "string" && header.includes("invalid_token")
}

const responseErrorHandler = async (error: AxiosError) => {
  const originalRequest = error.config as Retryable | undefined

  if (
    !originalRequest ||
    !isExpiredTokenError(error) ||
    originalRequest._retry
  ) {
    // console.log("El error no es de expiracion.")
    return Promise.reject(error)
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          }
          resolve(axios(originalRequest))
        },
        reject,
      })
    })
  }

  originalRequest._retry = true
  isRefreshing = true

  try {
    const newToken = await tokenService.refreshAccessToken()
    processQueue(null, newToken)
    originalRequest.headers = {
      ...originalRequest.headers,
      Authorization: `Bearer ${newToken}`,
    }
    return axios(originalRequest)
  } catch (refreshError) {
    processQueue(refreshError, null)
    tokenService.clearTokens()

    //------- Save the message from the refresh error to show it in the login page
    sessionStorage.setItem("sessionExpired", "1")
    const message =
      refreshError instanceof AxiosError
        ? (refreshError.response?.data?.message ?? refreshError.message)
        : "Tu sesión expiró"
    sessionStorage.setItem("sessionExpiredMessage", message)
    // --------------------------------------------------------------------------

    window.location.href = "/login"
    return Promise.reject(refreshError)
  } finally {
    isRefreshing = false
  }
}

axios.interceptors.response.use((r) => r, responseErrorHandler)

axios.defaults.withCredentials = true
// axios.defaults.withXSRFToken = true
