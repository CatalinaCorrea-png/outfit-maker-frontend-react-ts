import type { Garment } from "../../domain/Garment"
import "./garmentCard.css"

// Escala fija del back: 1 = deportivo ... 5 = formal
const FORMALITY_LEVELS = [1, 2, 3, 4, 5]

const GarmentCard = ({ garment }: { garment: Garment }) => {
  return (
    <article className={`garment-card ${garment.active ? "" : "is-archived"}`}>

      <figure className="garment-card-photo">
        {garment.imageUrl ? (
          <img className="garment-card-img" src={garment.imageUrl} alt={garment.name} loading="lazy" />
        ) : (
          <div className="garment-card-photo-empty" aria-hidden="true">👗</div>
        )}

        {garment.category && <span className="garment-card-chip is-category">{garment.category}</span>}

        <span className="garment-card-chip is-season">{garment.season}</span>

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

        {/* TODO i18n: estos son los valores crudos del enum ("striped", "slim").
            Van a querer pasar por t() con claves garment.pattern.* y garment.fit.* */}
        <ul className="garment-card-tags">
          <li className="garment-card-tag">{garment.pattern}</li>
          <li className="garment-card-tag">{garment.fit}</li>
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
}

export default GarmentCard
