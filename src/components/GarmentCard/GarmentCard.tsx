import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import type { Garment } from "../../domain/Garment"
import "./garmentCard.css"

// Escala fija del back: 1 = deportivo ... 5 = formal
const FORMALITY_LEVELS = [1, 2, 3, 4, 5]

type GarmentCardProps = {
  garment: Garment
  // Si viene, la card entera es un link (ej: al detalle de la prenda)
  to?: string
}

const GarmentCard = ({ garment, to }: GarmentCardProps) => {
  const { t } = useTranslation("garments")

  const card = (
    <article className={`garment-card ${garment.active ? "" : "is-archived"}`}>

      <figure className="garment-card-photo">
        {garment.frontGridUrl ? (
          <>
            <img className="garment-card-img" src={garment.frontGridUrl} alt={garment.name} loading="lazy" />
            {/* La espalda aparece en hover. Decorativa: el nombre ya lo anuncia la de adelante */}
            {garment.backGridUrl && (
              <img className="garment-card-img is-back" src={garment.backGridUrl} alt="" aria-hidden="true" loading="lazy" />
            )}
          </>
        ) : (
          <div className="garment-card-photo-empty" aria-hidden="true">👗</div>
        )}

        {garment.category && <span className="garment-card-chip is-category">{garment.category}</span>}

        <span className="garment-card-chip is-season">{t(`season.${garment.season}`)}</span>

        {!garment.active && <span className="garment-card-stamp">archivada</span>}
      </figure>

      <div className="garment-card-body">
        <header className="garment-card-head">
          <h3 className="garment-card-name" title={garment.name}>{garment.name}</h3>
          {garment.brand && <p className="garment-card-brand">{garment.brand}</p>}
        </header>

        <div className="garment-card-colors">
          <span
            className="garment-card-swatch"
            style={{ background: garment.primaryColor }}
            title={garment.primaryColor}
          />
          {garment.secondaryColor && (
            <span
              className="garment-card-swatch"
              style={{ background: garment.secondaryColor }}
              title={garment.secondaryColor}
            />
          )}
          {garment.material && <span className="garment-card-material">{garment.material}</span>}
        </div>

        <ul className="garment-card-tags">
          <li className="garment-card-tag">{t(`pattern.${garment.pattern}`)}</li>
          <li className="garment-card-tag">{t(`fit.${garment.fit}`)}</li>
        </ul>

        <footer className="garment-card-formality" title={`Formalidad ${garment.formality} de 5`}>
          {FORMALITY_LEVELS.map((level) => (
            <span
              key={level}
              className={`garment-card-dot ${level <= garment.formality ? "is-on" : ""}`}
            />
          ))}
        </footer>
      </div>
    </article>
  )

  // Un Link de verdad: andan el ctrl+click, "abrir en pestaña nueva" y el botón de atrás
  return to ? (
    <Link to={to} className="garment-card-link" aria-label={t("detail.open", { name: garment.name })}>
      {card}
    </Link>
  ) : card
}

export default GarmentCard
