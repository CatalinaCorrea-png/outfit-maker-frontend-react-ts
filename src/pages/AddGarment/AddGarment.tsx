import { useTranslation } from "react-i18next"
import ChipButton from "../../components/ChipButton/ChipButton"
import NotebookCard from "../../components/NotebookCard/NotebookCard"
import GarmentForm from "../../components/GarmentForm/GarmentForm"
import { emptyGarmentForm, type GarmentFormSubmit } from "../../components/GarmentForm/garmentFormValues"
import { garmentService } from "../../services/garmentService"
import { showToast } from "../../utils/toast"

/* Alta de prenda. El form (compartido con la edición) valida y prepara las fotos;
   acá solo se elige el endpoint. No redirige: queda listo para cargar la próxima. */
const AddGarment = () => {
	const { t } = useTranslation("garments")

	const createGarment = async ({ garment, front, back }: GarmentFormSubmit) => {
		// El form exige la de adelante y en el alta siempre es nueva
		if (!front) return
		await garmentService.createGarment(garment, { front, back })
		showToast.success(t("form.success"))
	}

	return (
		<main className="garment-form-page">
			<nav className="garment-form-nav">
				<ChipButton text={`← ${t("detail.back")}`} variant="ghost" to="/garments" />
			</nav>

			<NotebookCard tape="★ new in ★" sticker="✧" className="garment-form-card">
				<header className="garment-form-header">
					<h1 className="garment-form-title">{t("form.title")}</h1>
					<p className="garment-form-subtitle">{t("form.subtitle")}</p>
				</header>

				<GarmentForm
					mode="create"
					initialValues={emptyGarmentForm}
					onSubmit={createGarment}
					submitText={t("form.submit")}
					submittingText={t("form.submitting")}
				/>
			</NotebookCard>
		</main>
	)
}

export default AddGarment
