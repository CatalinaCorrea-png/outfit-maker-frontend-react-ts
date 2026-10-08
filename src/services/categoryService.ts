import axios from "axios"
import type { CategoryJSON } from "../dto/CategoryDTO"

class CategoryService {

    async getCategories(): Promise<CategoryJSON[]> {
        const response = await axios.get<CategoryJSON[]>(
            import.meta.env.VITE_API_URL + "/categories"
        )
        return response.data
    }

}

export const categoryService = new CategoryService()
