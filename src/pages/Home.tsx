import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher"
import BrandLink from "../components/BrandLink/BrandLink"
import GitHubLink from "../components/GitHubLink/GitHubLink"
import Polaroid, { type PhotoBackground, type TapeColor } from "../components/Polaroid/Polaroid"
import {
  DoodleAddGarment,
  DoodleHanger,
  DoodleLogin,
  DoodleOutfit,
  DoodleSparkles,
} from "../components/Doodles/Doodles"
import "./home.css"

type StepKey = "login" | "garments" | "outfits" | "ai"

type Step = {
  key: StepKey
  tape: TapeColor
  background: PhotoBackground
  tilt: number
}

// El orden es el recorrido de uso: entrar → cargar → combinar → pedirle a la IA
const steps: Step[] = [
  { key: "login", tape: "butter", background: "grid", tilt: -2.5 },
  { key: "garments", tape: "mint", background: "dots", tilt: 1.8 },
  { key: "outfits", tape: "sky", background: "stripes", tilt: -1.2 },
  { key: "ai", tape: "pink", background: "paper", tilt: 2.2 },
]

const Home = () => {
  const { t } = useTranslation("home")
  const { user } = useAuth()

  // Con sesión iniciada, los accesos llevan directo al placard
  const ctaTo = user ? "/garments" : "/login"
  const ctaText = user ? t("hero.ctaUser") : t("hero.ctaGuest")

  const photoFor = (key: StepKey) => {
    switch (key) {
      case "login":
        return <DoodleLogin />
      case "garments":
        return <DoodleAddGarment />
      case "outfits":
        return <DoodleOutfit />
      case "ai":
        return (
          <>
            <p className="landing-bubble">“{t("steps.ai.example")}”</p>
            <DoodleSparkles />
          </>
        )
    }
  }

  return (
    <div className="landing">
      <header className="landing-top">
        <BrandLink />
        <div className="landing-tools">
          <LanguageSwitcher />
          <Link to={ctaTo} className="landing-top-link">
            {user ? t("top.toWardrobe") : t("top.login")}
          </Link>
        </div>
      </header>

      <main className="landing-main">
        {/* ── Qué es ─────────────────────────────────────────────── */}
        <section className="landing-hero">
          <div className="landing-sheet">
            <div className="landing-holes" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="landing-sticker" aria-hidden="true">as if! ♡</span>

            <p className="landing-kicker">{t("hero.kicker")}</p>
            <h1 className="landing-title">
              outfit <em>maker</em>
            </h1>
            <p className="landing-lead">{t("hero.lead")}</p>
            <Link to={ctaTo} className="landing-cta">{ctaText}</Link>
          </div>

          <Polaroid
            caption={t("hero.photoCaption")}
            tape="lilac"
            background="plaid"
            tilt={3}
            className="landing-hero-photo"
          >
            <DoodleHanger />
          </Polaroid>
        </section>

        {/* ── Cómo se usa ────────────────────────────────────────── */}
        <section className="landing-howto" aria-labelledby="landing-howto-title">
          <header className="landing-section-head">
            <h2 id="landing-howto-title" className="landing-section-title">
              <span className="landing-marker">{t("howTo.title")}</span>
            </h2>
            <p className="landing-section-subtitle">{t("howTo.subtitle")}</p>
          </header>

          <ol className="landing-steps">
            {steps.map((step, index) => (
              <li key={step.key} className="landing-step">
                <span className="landing-step-num" aria-hidden="true">{index + 1}</span>
                {step.key === "ai" && (
                  <span className="landing-step-badge" aria-hidden="true">{t("steps.ai.badge")}</span>
                )}
                <Polaroid
                  caption={t(`steps.${step.key}.title`)}
                  note={t(`steps.${step.key}.body`)}
                  tape={step.tape}
                  background={step.background}
                  tilt={step.tilt}
                >
                  {photoFor(step.key)}
                </Polaroid>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Cierre ─────────────────────────────────────────────── */}
        <section className="landing-outro">
          <div className="landing-postit">
            <span className="landing-pin" aria-hidden="true" />
            <h2 className="landing-postit-title">{t("outro.title")}</h2>
            <p className="landing-postit-body">{t("outro.body")}</p>
            <Link to={ctaTo} className="landing-cta">{ctaText}</Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <GitHubLink />
      </footer>
    </div>
  )
}

export default Home
