export const Pattern = {
    SOLID: "solid",
    STRIPED: "striped",
    PLAID: "plaid",
    FLORAL: "floral",
    GRAPHIC: "graphic",
    DOTS: "dots",
    CAMO: "camo",
    ABSTRACT: "abstract"
}
export type Pattern = (typeof Pattern)[keyof typeof Pattern]