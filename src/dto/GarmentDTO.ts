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
    imageUrl: string | null,
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
    // userId: string | null, //? se agrega en el service
    category: string | null, // category name
    name: string | null,
    brand: string | null,
    primaryColor: string | null,
    secondaryColor: string | null,
    pattern: Pattern | null,
    material: string | null,
    formality: number | null,
    fit: Fit | null,
    season: Season | null,
    active: boolean | null,
    // paging & sorting
    page: number,
    pageSize: number,
    sortBy: string, // "name", "createdAt"
    ascending: boolean,
}

