export const Season = {
    SUMMER: "summer",
    WINTER: "winter",
    MID_SEASON: "mid_season",
    ALL_SEASONS: "all_seasons"
}
export type Season = (typeof Season)[keyof typeof Season]