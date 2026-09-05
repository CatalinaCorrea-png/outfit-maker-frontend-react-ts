// Los valores son los del enum de Kotlin (@Enumerated(STRING)): así viajan por
// la red y así los bindea Spring, que es case-sensitive. Lo lindo lo pone i18n.
export const Season = {
    SUMMER: "SUMMER",
    WINTER: "WINTER",
    MID_SEASON: "MID_SEASON",
    ALL_SEASONS: "ALL_SEASONS"
} as const
export type Season = (typeof Season)[keyof typeof Season]
