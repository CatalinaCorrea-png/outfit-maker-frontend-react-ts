import { useState, type ReactNode } from "react"
import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import ChipButton from "../../components/ChipButton/ChipButton"
import NotebookCard from "../../components/NotebookCard/NotebookCard"
import Polaroid, { type TapeColor } from "../../components/Polaroid/Polaroid"
import GarmentMissing from "../../components/GarmentMissing/GarmentMissing"
import Loader from "../../components/Loader/Loader"
import type { GarmentPhotoJSON } from "../../dto/GarmentDTO"
import { useGarment } from "../../hooks/useGarment"
import { garmentService } from "../../services/garmentService"
import { showToast } from "../../utils/toast"
import "./garmentDetail.css"

// Escala fija del back: 1 = deportivo ... 5 = formal
const FORMALITY_LEVELS = [1, 2, 3, 4, 5] as const

type PhotoProps = {
  photo: GarmentPhotoJSON | null
  caption: string
  alt: string
  tape: TapeColor
  tilt: number
}

// Una cara en grande: la original, no la miniatura de la card
const DetailPhoto = ({ photo, caption, alt, tape, tilt }: PhotoProps) => {
  const { t } = useTranslation("garments")
  return (
    <Polaroid
      caption={caption}
      tape={tape}
      tilt={tilt}
      background={photo ? "paper" : "dots"}
      className="garment-detail-polaroid"
    >
      {photo ? (
        <img className="garment-detail-img" src={photo.url} alt={alt} />
      ) : (
        <span className="garment-detail-empty">{t("detail.noPhoto")}</span>
      )}
    </Polaroid>
  )
}

// Una fila de la ficha: etiqueta a la izquierda, valor a la derecha
const Fact = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="garment-detail-fact">
    <dt className="garment-detail-label">{label}</dt>
    <dd className="garment-detail-value">{children}</dd>
  </div>
)

/* Detalle de una prenda: las fotos originales y la ficha completa.
   Usa la misma respuesta que la edición (GET /garments/{id}). */
const GarmentDetail = () => {
  const { t, i18n } = useTranslation("garments")
  const { id = "" } = useParams()
  const { status, garment, replace } = useGarment(id)
  const [isArchiving, setIsArchiving] = useState(false)

  if (status === "loading") return <Loader text={t("detail.loading")} />
  if (status !== "ready") return <GarmentMissing status={status} />

  // createdAt es una fecha sin hora ("2026-10-08"): new Date la toma como medianoche UTC,
  // así que se formatea en UTC para que en Argentina no muestre el día anterior
  const createdAt = garment.createdAt.toLocaleDateString(i18n.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })

  // Archivar y desarchivar son el mismo botón: se puede deshacer, así que no pide confirmación
  const toggleArchived = async () => {
    const archiving = garment.active
    setIsArchiving(true)
    try {
      replace(await garmentService.setGarmentActive(garment.id, !archiving))
      showToast.success(archiving ? t("detail.archiveSuccess") : t("detail.unarchiveSuccess"))
    } catch (error) {
      showToast.httpError(error, archiving ? t("detail.archiveError") : t("detail.unarchiveError"))
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <main className="garment-detail">
      <nav className="garment-detail-actions">
        <ChipButton text={`← ${t("detail.back")}`} variant="ghost" to="/garments" />
        <div className="garment-detail-actions-end">
          <ChipButton
            text={garment.active ? t("detail.archive") : t("detail.unarchive")}
            variant="ghost"
            onClick={toggleArchived}
            disabled={isArchiving}
          />
          <ChipButton text={`✎ ${t("detail.edit")}`} to={`/garments/${encodeURIComponent(garment.id)}/edit`} />
        </div>
      </nav>

      <div className={`garment-detail-sheet ${garment.active ? "" : "is-archived"}`}>
        <section className="garment-detail-photos">
          <DetailPhoto
            photo={garment.front}
            caption={t("form.photos.frontCaption")}
            alt={garment.name}
            tape="pink"
            tilt={-2}
          />
          {/* La de atrás solo si existe: un hueco vacío no aporta nada en el detalle */}
          {garment.back && (
            <DetailPhoto
              photo={garment.back}
              caption={t("form.photos.backCaption")}
              alt=""
              tape="sky"
              tilt={1.5}
            />
          )}
        </section>

        <NotebookCard tape={`★ ${garment.category ?? ""} ★`} sticker="✧" className="garment-detail-card">
          <header className="garment-detail-header">
            <h1 className="garment-detail-name">{garment.name}</h1>
            {garment.brand && <p className="garment-detail-brand">{garment.brand}</p>}
            {!garment.active && (
              <>
                <span className="garment-detail-stamp">{t("detail.archived")}</span>
                <p className="garment-detail-hint">{t("detail.archivedHint")}</p>
              </>
            )}
          </header>

          <dl className="garment-detail-facts">
            <Fact label={t("detail.category")}>{garment.category}</Fact>

            <Fact label={t("detail.colors")}>
              <span className="garment-detail-colors">
                <span
                  className="garment-detail-swatch"
                  style={{ background: garment.primaryColor }}
                  title={garment.primaryColor}
                />
                {garment.secondaryColor && (
                  <span
                    className="garment-detail-swatch"
                    style={{ background: garment.secondaryColor }}
                    title={garment.secondaryColor}
                  />
                )}
              </span>
            </Fact>

            <Fact label={t("detail.pattern")}>{t(`pattern.${garment.pattern}`)}</Fact>
            <Fact label={t("detail.fit")}>{t(`fit.${garment.fit}`)}</Fact>
            <Fact label={t("detail.season")}>{t(`season.${garment.season}`)}</Fact>

            <Fact label={t("detail.formality")}>
              <span className="garment-detail-formality">
                <span className="garment-detail-dots" aria-hidden="true">
                  {FORMALITY_LEVELS.map((level) => (
                    <span
                      key={level}
                      className={`garment-detail-dot ${level <= garment.formality ? "is-on" : ""}`}
                    />
                  ))}
                </span>
                {FORMALITY_LEVELS.some((level) => level === garment.formality)
                  ? t(`formality.${garment.formality as (typeof FORMALITY_LEVELS)[number]}`)
                  : "—"}
              </span>
            </Fact>

            {garment.material && <Fact label={t("detail.material")}>{garment.material}</Fact>}
            {garment.careNotes && <Fact label={t("detail.careNotes")}>{garment.careNotes}</Fact>}
            <Fact label={t("detail.createdAt")}>{createdAt}</Fact>
          </dl>
        </NotebookCard>
      </div>
    </main>
  )
}

export default GarmentDetail
