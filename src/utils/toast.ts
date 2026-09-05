import { HttpStatusCode } from "axios"
import { toast } from "react-toastify"
import i18n from "../i18n"
// El back manda un code estable; el idioma lo decide el front.
// Esta lista es el contrato: si el back agrega un code y acá no está,
// cae al detail en vez de romper.
const API_ERROR_CODES = [
  "AUTH_INVALID_CREDENTIALS",
  "USER_EMAIL_ALREADY_EXISTS",
  "USER_NOT_FOUND",
  "TOKEN_EXPIRED",
  "REQUEST_MALFORMED",
] as const

type ApiErrorCode = (typeof API_ERROR_CODES)[number]

const isApiErrorCode = (value: unknown): value is ApiErrorCode =>
  typeof value === "string" &&
  (API_ERROR_CODES as readonly string[]).includes(value)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (error: any): string => {
  const status = error?.response?.status

  if (status !== undefined) {
    // El guard de 500 va primero: el detail de un error interno puede traer
    // internas del server (stacktrace, datos de conexion) y no se muestran
    if (status >= 500) return i18n.t("http.server", { ns: "errors" })

    if (status === HttpStatusCode.Forbidden)
      return i18n.t("http.forbidden", { ns: "errors" })

    const data = error.response.data

    if (typeof data === "object" && data !== null) {
      // El GlobalExceptionHandler responde { status, code, error, detail, timestamp }
      const code: unknown = data.code
      if (isApiErrorCode(code)) return i18n.t(`api.${code}`, { ns: "errors" })

      if (data.detail) return data.detail
      // message cubre los errores que no pasan por el advice (default de Spring)
      if (data.message) return data.message
    }

    if (typeof data === "string" && data) return data
  }

  if (error?.code === "ERR_NETWORK")
    return i18n.t("http.network", { ns: "errors" })

  return error?.message ?? i18n.t("http.unknown", { ns: "errors" })
}

const showUnique = (fn: (msg: string, options: object) => void, msg: string, autoClose?: number) => {
  const id = msg
  if (!toast.isActive(id)) fn(msg, { toastId: id, autoClose })
}

export const showToast = {
  success: (msg: string, autoClose?: number) => showUnique(toast.success.bind(toast), msg, autoClose),
  warning: (msg: string, autoClose?: number) => showUnique(toast.warning.bind(toast), msg, autoClose),
  error: (msg: string, autoClose?: number) => showUnique(toast.error.bind(toast), msg, autoClose),
  httpError: (error: unknown, prefix?: string, autoClose?: number) => {
    const msg = getErrorMessage(error)
    const full = prefix ? `${prefix}: ${msg}` : msg
    showUnique(toast.error.bind(toast), full, autoClose)
  },
}