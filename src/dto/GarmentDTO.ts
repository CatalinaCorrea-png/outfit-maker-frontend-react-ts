import type { Fit } from "../domain/types/Fit"
import type { Pattern } from "../domain/types/Pattern"
import type { Season } from "../domain/types/Season"

export type GarmentJSON = {
    id: string,
    category: string, // category name
    name: string,
    brand: string,
    primaryColor: string,
    secondaryColor: string,
    pattern: Pattern,
    material: string,
    formality: number,
    fit: Fit,
    season: Season,
    careNotes: string | null,
    active: boolean,
    createdAt: string,
    // Miniatura de cada cara (o la original); null si la prenda no tiene esa foto
    frontImageUrl: string | null,
    backImageUrl: string | null,
}

// Forma de GarmentCreateDTO del back: la parte "garment" del multipart de
// POST /garments/create. Las fotos no van acá: viajan como archivos en el mismo request.
export type GarmentCreateJSON = {
    category: string, // category name
    name: string,
    brand: string,
    primaryColor: string,
    secondaryColor: string,
    pattern: Pattern,
    material: string,
    formality: number,
    fit: Fit,
    season: Season,
    careNotes: string | null,
}

// Forma de PageResponse<T> del back.
export type GarmentPageResponse = {
    content: GarmentJSON[],
    page: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
}

export type GarmentFilters = {
    // filtering
    // Sin userId: el back filtra siempre por el usuario del token
    category: string | null, // category name
    name: string | null,
    brand: string | null,
    pattern: Pattern | null,
    formality: number | null,
    season: Season | null,
    active: boolean | null,
    // paging & sorting
    page: number,
    pageSize: number,
    sortBy: string, // "name", "createdAt"
    ascending: boolean,
}

