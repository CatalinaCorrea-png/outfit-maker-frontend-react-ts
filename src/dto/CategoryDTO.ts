import type { Slot } from "../domain/types/Slot"

// Forma de CategoryDTO del back (GET /categories)
export type CategoryJSON = {
    name: string,
    slot: Slot,
}
