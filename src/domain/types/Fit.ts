export const Fit = {
    SLIM: "slim",
    REGULAR: "regular",
    RELAXED: "relaxed",
    OVERSIZED: "oversized"
}
export type Fit = (typeof Fit)[keyof typeof Fit]