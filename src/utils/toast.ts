import { HttpStatusCode } from "axios"
import { toast } from "react-toastify"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (error: any): string => {
  const status = error?.response?.status

  if (status !== undefined) {
    // El guard de 500 va primero: el detail de un error interno puede traer
    // internas del server (stacktrace, datos de conexion) y no se muestran
    if (status >= 500) return "Ocurrió un error, consulte al administrador."

    if (status === HttpStatusCode.Forbidden)
      return "No tenés autorización para realizar esta acción"

    const data = error.response.data

    if (typeof data === "object" && data !== null) {
      // El GlobalExceptionHandler responde { status, error, detail, timestamp }
      if (data.detail) return data.detail
      // message cubre los errores que no pasan por el advice (default de Spring)
      if (data.message) return data.message
    }

    if (typeof data === "string" && data) return data
  }

  if (error?.code === "ERR_NETWORK")
    return "Problema de conexión con el servidor. Intente más tarde."

  return error?.message ?? "Error desconocido"
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