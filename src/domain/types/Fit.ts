// Los valores son los del enum de Kotlin (@Enumerated(STRING)): así viajan por
// la red y así los bindea Spring, que es case-sensitive. Lo lindo lo pone i18n.
export const Fit = {
    SLIM: "SLIM",
    REGULAR: "REGULAR",
    RELAXED: "RELAXED",
    OVERSIZED: "OVERSIZED"
} as const
export type Fit = (typeof Fit)[keyof typeof Fit]
