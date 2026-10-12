import { useEffect, useState } from "react"
import axios, { HttpStatusCode } from "axios"
import { useTranslation } from "react-i18next"
import type { Garment } from "../domain/Garment"
import { garmentService } from "../services/garmentService"
import { showToast } from "../utils/toast"

type GarmentState =
    | { status: "loading" | "notFound" | "error"; garment: null }
    | { status: "ready"; garment: Garment }

// replace: para mostrar la prenda que devolvió el server tras un cambio (ej: archivarla)
// sin volver a pedirla
export type GarmentLoad = GarmentState & { replace: (garment: Garment) => void }

// Lo cargado, con el id al que corresponde
type Loaded = { id: string } & GarmentState

/*
Trae una prenda por id. La comparten el detalle y la edición.
El estado guarda el id de lo que cargó: si la URL cambia a otra prenda, lo viejo
no se muestra (vuelve a "loading") sin hacer un setState sincrónico en el efecto.
*/
export const useGarment = (id: string): GarmentLoad => {
    const { t } = useTranslation("garments")
    const [loaded, setLoaded] = useState<Loaded | null>(null)

    useEffect(() => {
        // Si cambia el id antes de que llegue la respuesta, se ignora la vieja
        let ignore = false

        garmentService.getGarment(id)
            .then((garment) => {
                if (!ignore) setLoaded({ id, status: "ready", garment })
            })
            .catch((error) => {
                if (ignore) return
                // 404 es un estado de la pantalla (otra cuenta o id inválido), no un toast
                const notFound = axios.isAxiosError(error) && error.response?.status === HttpStatusCode.NotFound
                if (!notFound) showToast.httpError(error, t("form.loadError"))
                setLoaded({ id, status: notFound ? "notFound" : "error", garment: null })
            })

        return () => {
            ignore = true
        }
    }, [id, t])

    const replace = (garment: Garment) => setLoaded({ id, status: "ready", garment })

    if (!loaded || loaded.id !== id) return { status: "loading", garment: null, replace }
    return { ...loaded, replace }
}
