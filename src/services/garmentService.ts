import axios from "axios"
import { Garment } from "../domain/Garment"
import type { GarmentCreateJSON, GarmentFilters, GarmentJSON, GarmentPageResponse } from "../dto/GarmentDTO"
import type { PreparedImage } from "../utils/image"

// Las fotos ya preparadas (achicadas y con miniatura). La de atrás es opcional.
export type GarmentPhotoUploads = {
    front: PreparedImage
    back: PreparedImage | null
}

// En la edición cada foto es opcional: solo viajan las que cambiaron.
// removeBack quita la de atrás sin reemplazarla.
export type GarmentPhotoChanges = {
    front: PreparedImage | null
    back: PreparedImage | null
    removeBack: boolean
}

// El back elige la extensión por el tipo, así que el nombre es solo para el multipart
const fileName = (part: string, blob: Blob) => `${part}.${blob.type.split("/")[1] ?? "webp"}`

// El multipart que esperan el alta y la edición: el JSON de la prenda y las fotos que haya
const garmentForm = (garment: GarmentCreateJSON, front: PreparedImage | null, back: PreparedImage | null) => {
    const form = new FormData()
    // El JSON viaja como una parte más: el Content-Type le dice al back que lo lea como JSON
    form.append("garment", new Blob([JSON.stringify(garment)], { type: "application/json" }))
    if (front) {
        form.append("front", front.original, fileName("front", front.original))
        form.append("frontThumb", front.thumb, fileName("frontThumb", front.thumb))
    }
    if (back) {
        form.append("back", back.original, fileName("back", back.original))
        form.append("backThumb", back.thumb, fileName("backThumb", back.thumb))
    }
    return form
}

class GarmentService {

    async getGarments(filters: GarmentFilters): Promise<Garment[]> {
        const response = await axios.get<GarmentPageResponse>(
            import.meta.env.VITE_API_URL + "/garments/filtered-garments",
            // El usuario sale del token en el back: acá solo viajan los filtros
            { params: filters }
        )
        return response.data.content.map((json) => Garment.fromJSON(json))
    }

    // Una prenda completa, con las fotos originales: detalle y form de edición
    async getGarment(id: string): Promise<Garment> {
        const response = await axios.get<GarmentJSON>(
            `${import.meta.env.VITE_API_URL}/garments/${encodeURIComponent(id)}`
        )
        return Garment.fromJSON(response.data)
    }

    // Alta atómica: datos y fotos en un solo request. El back valida todo antes de
    // escribir, y si algo falla no queda ni la prenda ni ninguna foto.
    async createGarment(garment: GarmentCreateJSON, photos: GarmentPhotoUploads): Promise<Garment> {
        // Con FormData axios deja que el navegador ponga el Content-Type con el boundary
        const response = await axios.post<GarmentJSON>(
            import.meta.env.VITE_API_URL + "/garments/create",
            garmentForm(garment, photos.front, photos.back)
        )
        return Garment.fromJSON(response.data)
    }

    // Archivar (false) o desarchivar (true): no toca ni los datos ni las fotos
    async setGarmentActive(id: string, active: boolean): Promise<Garment> {
        const response = await axios.patch<GarmentJSON>(
            `${import.meta.env.VITE_API_URL}/garments/${encodeURIComponent(id)}/active`,
            { active }
        )
        return Garment.fromJSON(response.data)
    }

    // Edición atómica, igual que el alta. Las fotos que no vienen se mantienen;
    // las reemplazadas las borra el back recién después de guardar.
    async updateGarment(id: string, garment: GarmentCreateJSON, photos: GarmentPhotoChanges): Promise<Garment> {
        const form = garmentForm(garment, photos.front, photos.back)
        if (photos.removeBack) form.append("removeBack", "true")

        const response = await axios.put<GarmentJSON>(
            `${import.meta.env.VITE_API_URL}/garments/${encodeURIComponent(id)}`,
            form
        )
        return Garment.fromJSON(response.data)
    }

}

export const garmentService = new GarmentService()
