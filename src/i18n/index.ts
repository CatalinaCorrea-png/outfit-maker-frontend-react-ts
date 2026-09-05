import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import esCommon from "./locales/es/common.json"
import esAuth from "./locales/es/auth.json"
import esErrors from "./locales/es/errors.json"
import esGarments from "./locales/es/garments.json"
import enCommon from "./locales/en/common.json"
import enAuth from "./locales/en/auth.json"
import enErrors from "./locales/en/errors.json"
import enGarments from "./locales/en/garments.json"

export const SUPPORTED_LANGUAGES = ["es", "en"] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const defaultNS = "common"

export const resources = {
  es: { common: esCommon, auth: esAuth, errors: esErrors, garments: esGarments },
  en: { common: enCommon, auth: enAuth, errors: enErrors, garments: enGarments },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    ns: ["common", "auth", "errors", "garments"],
    fallbackLng: "es",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    // "es-AR" y "en-US" del navegador colapsan a "es" y "en"
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "outfit-maker-lang",
      caches: ["localStorage"],
    },
    // React ya escapa todo lo que renderiza: escapar de nuevo
    // convertiría "contraseña" en entidades HTML.
    interpolation: { escapeValue: false },
  })

// <html lang> tiene que seguir al idioma activo: es lo que leen los
// lectores de pantalla y el corrector ortográfico del navegador.
const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng
}
syncHtmlLang(i18n.resolvedLanguage ?? "es")
i18n.on("languageChanged", syncHtmlLang)

export default i18n