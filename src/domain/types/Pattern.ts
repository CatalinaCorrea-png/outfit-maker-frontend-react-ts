// Los valores son los del enum de Kotlin (@Enumerated(STRING)): así viajan por
// la red y así los bindea Spring, que es case-sensitive. Lo lindo lo pone i18n.
export const Pattern = {
    SOLID: "SOLID",
    STRIPED: "STRIPED",
    PLAID: "PLAID",
    FLORAL: "FLORAL",
    GRAPHIC: "GRAPHIC",
    DOTS: "DOTS",
    CAMO: "CAMO",
    ABSTRACT: "ABSTRACT"
} as const
export type Pattern = (typeof Pattern)[keyof typeof Pattern]
