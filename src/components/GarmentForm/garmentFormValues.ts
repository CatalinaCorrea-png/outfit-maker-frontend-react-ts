import type { FormalityLevel } from "../FormalityDots/FormalityDots"
import type { PhotoSelection } from "../PhotoPicker/PhotoPicker"
import type { Garment } from "../../domain/Garment"
import { Pattern } from "../../domain/types/Pattern"
import { Fit } from "../../domain/types/Fit"
import { Season } from "../../domain/types/Season"
import type { GarmentCreateJSON } from "../../dto/GarmentDTO"
import type { PreparedImage } from "../../utils/image"
import { toHexColor } from "../../utils/color"

// Los valores del GarmentForm, aparte del componente para que fast refresh funcione:
// las páginas los usan para arrancar el form (vacío en el alta, con la prenda en la edición).

export type GarmentFormValues = {
	name: string
	category: string
	brand: string
	material: string
	primaryColor: string
	hasSecondaryColor: boolean
	secondaryColor: string
	pattern: Pattern
	fit: Fit
	season: Season
	formality: FormalityLevel | null
	careNotes: string
	front: PhotoSelection | null
	back: PhotoSelection | null
}

// Lo que el form le entrega a la página: los datos ya validados y solo las fotos NUEVAS,
// ya preparadas. Una foto que no cambió viaja como null (el back la mantiene).
export type GarmentFormSubmit = {
	garment: GarmentCreateJSON
	front: PreparedImage | null
	back: PreparedImage | null
	// Había foto de atrás y el form la dejó vacía
	removeBack: boolean
}

// Los colores arrancan con un valor porque el picker no puede quedar "vacío":
// lo que se ve en el swatch es lo que se guarda.
export const emptyGarmentForm: GarmentFormValues = {
	name: "",
	category: "",
	brand: "",
	material: "",
	primaryColor: "#000000",
	hasSecondaryColor: false,
	secondaryColor: "#ffffff",
	pattern: Pattern.SOLID,
	fit: Fit.REGULAR,
	season: Season.ALL_SEASONS,
	formality: null,
	careNotes: "",
	front: null,
	back: null,
}

const toFormalityLevel = (formality: number): FormalityLevel | null =>
	Number.isInteger(formality) && formality >= 1 && formality <= 5 ? (formality as FormalityLevel) : null

// Para la edición: el form arranca con la prenda guardada. Las fotos son las del
// server (file null) y la preview es la original, que se ve nítida en la polaroid.
export const garmentToFormValues = (garment: Garment): GarmentFormValues => ({
	name: garment.name,
	category: garment.category ?? "",
	brand: garment.brand,
	material: garment.material,
	// El picker solo entiende #rrggbb: "navy" (seed) o "#fff" se traducen
	primaryColor: toHexColor(garment.primaryColor),
	hasSecondaryColor: garment.secondaryColor !== "",
	secondaryColor: garment.secondaryColor ? toHexColor(garment.secondaryColor, "#ffffff") : "#ffffff",
	pattern: garment.pattern,
	fit: garment.fit,
	season: garment.season,
	formality: toFormalityLevel(garment.formality),
	careNotes: garment.careNotes ?? "",
	front: garment.front ? { file: null, previewUrl: garment.front.url } : null,
	back: garment.back ? { file: null, previewUrl: garment.back.url } : null,
})
