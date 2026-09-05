import type { ValidationKey, ValidationParams } from "../components/ValidationField/ValidationMessage";
import { ValidationMessage } from "../components/ValidationField/ValidationMessage";
import type { GarmentJSON } from "../dto/GarmentDTO";
import { Fit } from "./types/Fit";
import { Pattern } from "./types/Pattern";
import { Season } from "./types/Season";

// Las columnas de texto del back son varchar(255) por defecto
const MAX_TEXT_LENGTH = 255

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
// Nombre normalizado: "navy", "off white", "rosa-viejo"
// Cuando agregue un color picker esto vuela
const COLOR_NAME_REGEX = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+(?:[\s-][a-zA-ZáéíóúñÁÉÍÓÚÑ]+)*$/

export class Garment {
    errors: ValidationMessage[] = []

    public id: string = ""
    // null = todavía no eligió categoría en el form
    public category: string | null = null // category name
    public name: string = ""
    public brand: string = ""
    public primaryColor: string = ""
    public secondaryColor: string = ""
    public pattern: Pattern = Pattern.SOLID
    // "algodón", "lino", "cuero", "poliéster"
    public material: string = ""
    public formality: number = 0 // 1 - 5
    public fit: Fit = Fit.REGULAR
    public season: Season = Season.ALL_SEASONS
    public careNotes: string | null = null
    // Soft delete: false = prenda donada/vendida, pero los outfits históricos quedan
    public active: boolean = true
    public createdAt: Date = new Date()
    public imageUrl: string | null = null

    constructor(
        id: string = "",
        category: string | null = null,
        name: string = "",
        brand: string = "",
        primaryColor: string = "",
        secondaryColor: string = "",
        pattern: Pattern = Pattern.SOLID,
        material: string = "",
        formality: number = 0,
        fit: Fit = Fit.REGULAR,
        season: Season = Season.ALL_SEASONS,
        careNotes: string | null = null,
        active: boolean = true,
        createdAt: Date = new Date(),
        imageUrl: string | null = null
    ) {
        this.id = id
        this.category = category
        this.name = name.trim()
        this.brand = brand.trim()
        this.primaryColor = primaryColor.trim()
        this.secondaryColor = secondaryColor.trim()
        this.pattern = pattern
        this.material = material.trim()
        this.formality = formality
        this.fit = fit
        this.season = season
        this.careNotes = careNotes
        this.active = active
        this.createdAt = createdAt
        this.imageUrl = imageUrl
    }

    static fromJSON(json: GarmentJSON): Garment {
        return new Garment(
          json.id, json.category, json.name, json.brand,
          json.primaryColor, json.secondaryColor ?? "",
          json.pattern, json.material, json.formality,
          json.fit, json.season, json.careNotes, json.active,
          new Date(json.createdAt), json.imageUrl
      )
    }

    addError(field: string, message: ValidationKey, params?: ValidationParams) {
        this.errors.push(new ValidationMessage(field, message, params))
    }

    private addTooLongError(field: string) {
        this.addError(field, "validation.tooLong", { max: MAX_TEXT_LENGTH })
    }
      
    // El back acepta hex ("#1a237e") o un nombre normalizado ("navy")
    private isValidColor(color: string) {
        const value = color.trim()
        return value.startsWith("#") ? HEX_COLOR_REGEX.test(value) : COLOR_NAME_REGEX.test(value)
    }

    validate() {
        this.errors = []

        if (!this.name?.trim()) {
            this.addError("name", "validation.nameRequired")
        } else if (this.name.trim().length > MAX_TEXT_LENGTH) {
            this.addTooLongError("name")
        }

        if (!this.category) {
            this.addError("category", "validation.categoryRequired")
        }

        if (!this.primaryColor?.trim()) {
            this.addError("primaryColor", "validation.primaryColorRequired")
        } else if (!this.isValidColor(this.primaryColor)) {
            this.addError("primaryColor", "validation.primaryColorInvalid")
        }

        // El secundario es opcional, pero si lo cargan tiene que ser válido
        if (this.secondaryColor?.trim() && !this.isValidColor(this.secondaryColor)) {
            this.addError("secondaryColor", "validation.secondaryColorInvalid")
        }

        // 0 es el default del constructor: significa "todavía no eligió"
        if (!this.formality) {
            this.addError("formality", "validation.formalityRequired")
        } else if (!Number.isInteger(this.formality) || this.formality < 1 || this.formality > 5) {
            this.addError("formality", "validation.formalityRange")
        }

        if (!Object.values(Pattern).includes(this.pattern)) {
            this.addError("pattern", "validation.patternInvalid")
        }

        if (!Object.values(Fit).includes(this.fit)) {
            this.addError("fit", "validation.fitInvalid")
        }

        if (!Object.values(Season).includes(this.season)) {
            this.addError("season", "validation.seasonInvalid")
        }

        // Opcionales: solo chequeamos que entren en la columna
        if (this.brand.trim().length > MAX_TEXT_LENGTH) {
            this.addTooLongError("brand")
        }

        if (this.material.trim().length > MAX_TEXT_LENGTH) {
            this.addTooLongError("material")
        }

        if ((this.careNotes?.trim().length ?? 0) > MAX_TEXT_LENGTH) {
            this.addTooLongError("careNotes")
        }

        return this.errors
    }

}