import { useTranslation } from "react-i18next"
import { SUPPORTED_LANGUAGES } from "../../i18n"
import "./languageSwitcher.css"

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation("common")
  const current = i18n.resolvedLanguage ?? "es"

  return (
    <div className="lang-switch" role="group" aria-label={t("languageLabel")}>
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          className="lang-switch-option"
          aria-pressed={current === lng}
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher