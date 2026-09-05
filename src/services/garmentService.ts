import axios from "axios"
import { Garment } from "../domain/Garment"
import type { GarmentFilters, GarmentPageResponse } from "../dto/GarmentDTO"
import { getId } from "../context/AuthContext"

class GarmentService {

    async getGarments(filters: GarmentFilters): Promise<Garment[]> {
        const response = await axios.get<GarmentPageResponse>(
            import.meta.env.VITE_API_URL + "/garments/filtered-garments",
            {
                params: {
                    userId: getId(),
                    ...filters,
                }
            }
        )
        return response.data.content.map((json) => Garment.fromJSON(json))
    }

}

export const garmentService = new GarmentService()
