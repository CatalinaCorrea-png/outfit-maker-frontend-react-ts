// Los valores son los del enum de Java (@Enumerated(STRING)): así viajan por
// la red. Es la zona del cuerpo de cada categoría.
export const Slot = {
    UPPER: "UPPER",
    LOWER: "LOWER",
    FOOTWEAR: "FOOTWEAR",
    OUTERWEAR: "OUTERWEAR",
    ACCESSORY: "ACCESSORY",
    FULL_BODY: "FULL_BODY"
} as const
export type Slot = (typeof Slot)[keyof typeof Slot]
