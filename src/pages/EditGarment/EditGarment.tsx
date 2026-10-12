import { useNavigate, useParams } from "react-router"
import { useTranslation } from "react-i18next"
import ChipButton from "../../components/ChipButton/ChipButton"
import NotebookCard from "../../components/NotebookCard/NotebookCard"
import GarmentForm from "../../components/GarmentForm/GarmentForm"
import { garmentToFormValues, type GarmentFormSubmit } from "../../components/GarmentForm/garmentFormValues"
import GarmentMissing from "../../components/GarmentMissing/GarmentMissing"
import Loader from "../../components/Loader/Loader"
import { garmentService } from "../../services/garmentService"
import { useGarment } from "../../hooks/useGarment"
import { showToast } from "../../utils/toast"

/* Edición: el mismo form que el alta, arrancando con la prenda guardada.
   Solo viajan las fotos que cambiaron; al guardar vuelve al detalle. */
const EditGarment = () => {
	const { t } = useTranslation("garments")
	const { id = "" } = useParams()
	const navigate = useNavigate()
	const { status, garment } = useGarment(id)

	if (status === "loading") return <Loader text={t("detail.loading")} />
	if (status !== "ready") return <GarmentMissing status={status} />

	const detailUrl = `/garments/${encodeURIComponent(id)}`

	const updateGarment = async ({ garment: data, front, back, removeBack }: GarmentFormSubmit) => {
		await garmentService.updateGarment(id, data, { front, back, removeBack })
		showToast.success(t("form.editSuccess"))
		navigate(detailUrl)
	}

	return (
		<main className="garment-form-page">
			<nav className="garment-form-nav">
				<ChipButton text={`← ${t("detail.backToGarment")}`} variant="ghost" to={detailUrl} />
			</nav>

			<NotebookCard tape="✎ edit ✎" sticker="✧" className="garment-form-card">
				<header className="garment-form-header">
					<h1 className="garment-form-title">{t("form.editTitle")}</h1>
					<p className="garment-form-subtitle">{t("form.editSubtitle")}</p>
				</header>

				{/* key: si llega otra prenda, el form arranca de cero con sus datos */}
				<GarmentForm
					key={garment.id}
					mode="edit"
					initialValues={garmentToFormValues(garment)}
					onSubmit={updateGarment}
					submitText={t("form.saveChanges")}
					submittingText={t("form.submitting")}
					cancelTo={detailUrl}
				/>
			</NotebookCard>
		</main>
	)
}

export default EditGarment
