import axios from "axios"
import { Garment } from "../domain/Garment"
import type { GarmentCreateJSON, GarmentFilters, GarmentJSON, GarmentPageResponse } from "../dto/GarmentDTO"
import type { PreparedImage } from "../utils/image"

// Las fotos ya preparadas (achicadas y con miniatura). La de atrás es opcional.
export type GarmentPhotoUploads = {
    front: PreparedImage
    back: PreparedImage | null
}

// El back elige la extensión por el tipo, así que el nombre es solo para el multipart
const fileName = (part: string, blob: Blob) => `${part}.${blob.type.split("/")[1] ?? "webp"}`

class GarmentService {

    async getGarments(filters: GarmentFilters): Promise<Garment[]> {
        const response = await axios.get<GarmentPageResponse>(
            import.meta.env.VITE_API_URL + "/garments/filtered-garments",
            // El usuario sale del token en el back: acá solo viajan los filtros
            { params: filters }
        )
        return response.data.content.map((json) => Garment.fromJSON(json))
    }

    // Alta atómica: datos y fotos en un solo request. El back valida todo antes de
    // escribir, y si algo falla no queda ni la prenda ni ninguna foto.
    async createGarment(garment: GarmentCreateJSON, photos: GarmentPhotoUploads): Promise<Garment> {
        const form = new FormData()
        // El JSON viaja como una parte más: el Content-Type le dice al back que lo lea como JSON
        form.append("garment", new Blob([JSON.stringify(garment)], { type: "application/json" }))
        form.append("front", photos.front.original, fileName("front", photos.front.original))
        form.append("frontThumb", photos.front.thumb, fileName("frontThumb", photos.front.thumb))
        if (photos.back) {
            form.append("back", photos.back.original, fileName("back", photos.back.original))
            form.append("backThumb", photos.back.thumb, fileName("backThumb", photos.back.thumb))
        }

        // Con FormData axios deja que el navegador ponga el Content-Type con el boundary
        const response = await axios.post<GarmentJSON>(
            import.meta.env.VITE_API_URL + "/garments/create",
            form
        )
        return Garment.fromJSON(response.data)
    }

}

export const garmentService = new GarmentService()
