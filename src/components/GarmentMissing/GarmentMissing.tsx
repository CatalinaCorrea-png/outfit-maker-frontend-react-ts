import { useTranslation } from "react-i18next"
import ChipButton from "../ChipButton/ChipButton"
import "./garmentMissing.css"

type GarmentMissingProps = {
  // notFound: no existe o es de otra cuenta. error: no se pudo cargar (red, server).
  status: "notFound" | "error"
}

/* Lo que muestran el detalle y la edición cuando la prenda no llega */
const GarmentMissing = ({ status }: GarmentMissingProps) => {
  const { t } = useTranslation("garments")

  return (
    <main className="garment-missing">
      <div className="garment-missing-note">
        <span className="garment-missing-icon" aria-hidden="true">🧺</span>
        <h1 className="garment-missing-title">
          {status === "notFound" ? t("detail.notFoundTitle") : t("form.loadError")}
        </h1>
        {status === "notFound" && <p className="garment-missing-text">{t("detail.notFoundText")}</p>}
        <ChipButton text={t("detail.back")} to="/garments" />
      </div>
    </main>
  )
}

export default GarmentMissing
