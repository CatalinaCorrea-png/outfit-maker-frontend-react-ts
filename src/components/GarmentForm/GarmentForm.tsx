import { useRef, useState } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import FormField from "../FormField/FormField"
import SelectField from "../SelectField/SelectField"
import FormalityDots from "../FormalityDots/FormalityDots"
import PhotoPicker, { type PhotoSelection } from "../PhotoPicker/PhotoPicker"
import KeyButton from "../KeyButton/KeyButton"
import ChipButton from "../ChipButton/ChipButton"
import ValidationField from "../ValidationField/ValidationField"
import { ValidationMessage } from "../ValidationField/ValidationMessage"
import { Garment } from "../../domain/Garment"
import { Pattern } from "../../domain/types/Pattern"
import { Fit } from "../../domain/types/Fit"
import { Season } from "../../domain/types/Season"
import type { CategoryJSON } from "../../dto/CategoryDTO"
import { categoryService } from "../../services/categoryService"
import { useOnInit } from "../../hooks/useOnInit"
import { prepareImage, UnreadableImageError } from "../../utils/image"
import { showToast } from "../../utils/toast"
import "../FormField/formField.css"
import type { GarmentFormSubmit, GarmentFormValues } from "./garmentFormValues"
import "./garmentForm.css"

// Los campos que se escriben tal cual vienen del input
type TextKey = "name" | "category" | "brand" | "material" | "primaryColor" | "secondaryColor" | "careNotes"

type CategoriesStatus = "loading" | "ready" | "error"

// El form se traduce a la prenda del dominio, que es la que sabe validarse
const toGarment = (form: GarmentFormValues) =>
	new Garment(
		"",
		form.category || null,
		form.name,
		form.brand,
		form.primaryColor,
		form.hasSecondaryColor ? form.secondaryColor : "",
		form.pattern,
		form.material,
		form.formality ?? 0,
		form.fit,
		form.season,
		form.careNotes.trim() || null,
	)

type GarmentFormProps = {
	// create: al guardar se vacía y queda listo para la próxima.
	// edit: al guardar la página navega (el form no se toca).
	mode: "create" | "edit"
	initialValues: GarmentFormValues
	// Si falla, el form muestra el error (nombre repetido en su campo, el resto en un toast)
	onSubmit: (data: GarmentFormSubmit) => Promise<void>
	submitText: string
	submittingText: string
	// Link de "Cancelar" (en la edición vuelve al detalle)
	cancelTo?: string
}

/* El formulario de una prenda: lo comparten el alta y la edición.
   Valida con el dominio, prepara las fotos nuevas y le pasa todo a la página,
   que decide a qué endpoint mandarlo. */
const GarmentForm = ({ mode, initialValues, onSubmit, submitText, submittingText, cancelTo }: GarmentFormProps) => {
	const { t } = useTranslation("garments")
	const [form, setForm] = useState<GarmentFormValues>(initialValues)
	const [errors, setErrors] = useState<ValidationMessage[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [categories, setCategories] = useState<CategoryJSON[]>([])
	const [categoriesStatus, setCategoriesStatus] = useState<CategoriesStatus>("loading")
	const formRef = useRef<HTMLFormElement>(null)

	const loadCategories = async () => {
		try {
			setCategories(await categoryService.getCategories())
			setCategoriesStatus("ready")
		} catch (error) {
			setCategoriesStatus("error")
			showToast.httpError(error, t("form.categoriesError"))
		}
	}

	useOnInit(() => {
		loadCategories()
	})

	const setField = <K extends keyof GarmentFormValues>(key: K, value: GarmentFormValues[K]) =>
		setForm((prev) => ({ ...prev, [key]: value }))

	// Un solo handler para los campos de texto: la clave dice cuál actualizar
	const handleChange = (key: TextKey) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
			setField(key, e.target.value)

	// Achica la foto y genera la miniatura. Solo las nuevas: la del server ya está lista.
	// Si el navegador no la puede leer (ej: HEIC en Chrome), marca el campo de esa foto
	// en vez de cortar todo.
	const preparePhoto = async (photo: PhotoSelection | null, field: string, garment: Garment) => {
		if (!photo?.file) return null
		try {
			return await prepareImage(photo.file)
		} catch (error) {
			if (!(error instanceof UnreadableImageError)) throw error
			garment.addError(field, "validation.photoUnreadable")
			return null
		}
	}

	// Las previews las libera el PhotoPicker al cambiar su foto
	const resetForm = () => {
		setForm(initialValues)
		setErrors([])
		formRef.current?.querySelector<HTMLInputElement>("#name")?.focus()
	}

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isSubmitting) return

		const garment = toGarment(form)
		garment.validate()
		// Regla del formulario, no de la prenda: el bootstrap siembra prendas sin fotos.
		// En la edición cuenta la que ya tiene en el server.
		if (!form.front) garment.addError("front", "validation.frontPhotoRequired")
		if (garment.errors.length > 0) {
			setErrors(garment.errors)
			return
		}

		setIsSubmitting(true)
		try {
			// 1. Preparar las fotos nuevas antes de enviar nada: si una no se puede leer, no viaja ninguna
			const front = await preparePhoto(form.front, "front", garment)
			const back = await preparePhoto(form.back, "back", garment)
			if (garment.errors.length > 0) {
				setErrors(garment.errors)
				return
			}

			// 2. Datos y fotos en un solo request: o se guarda todo o no se guarda nada
			try {
				await onSubmit({
					garment: garment.toCreateJSON(),
					front,
					back,
					removeBack: initialValues.back !== null && form.back === null,
				})
			} catch (error) {
				// El nombre repetido se muestra en su campo, no solo como toast
				if (axios.isAxiosError(error) && error.response?.data?.code === "GARMENT_ALREADY_EXISTS") {
					setErrors([new ValidationMessage("name", "validation.nameTaken")])
				} else {
					showToast.httpError(error, t("form.error"))
				}
				return
			}

			if (mode === "create") resetForm()
		} finally {
			setIsSubmitting(false)
		}
	}

	const optional = (label: string) => `${label} ${t("form.optional")}`

	return (
		<form ref={formRef} onSubmit={handleSubmit} className="garment-form" noValidate>
			<section className="garment-form-photos">
				<PhotoPicker
					id="front"
					label={t("form.photos.frontLabel")}
					caption={t("form.photos.frontCaption")}
					photo={form.front}
					onChange={(photo) => setField("front", photo)}
					errors={errors}
					tape="pink"
					tilt={-2}
				/>
				<PhotoPicker
					id="back"
					label={optional(t("form.photos.backLabel"))}
					caption={t("form.photos.backCaption")}
					photo={form.back}
					onChange={(photo) => setField("back", photo)}
					errors={errors}
					tape="sky"
					tilt={1.5}
				/>
			</section>

			<section className="garment-form-fields form-stack">
				<FormField
					id="name"
					label={t("form.name")}
					placeholder={t("form.namePlaceholder")}
					value={form.name}
					onChange={handleChange("name")}
					errors={errors}
				/>

				<SelectField
					id="category"
					label={t("form.category")}
					value={form.category}
					onChange={handleChange("category")}
					errors={errors}
					disabled={categoriesStatus !== "ready"}
				>
					<option value="">{t("form.categoryPlaceholder")}</option>
					{categories.map((category) => (
						<option key={category.name} value={category.name}>
							{category.name}
						</option>
					))}
				</SelectField>

				<div className="garment-form-row">
					<FormField
						id="brand"
						label={optional(t("form.brand"))}
						placeholder={t("form.brandPlaceholder")}
						value={form.brand}
						onChange={handleChange("brand")}
						errors={errors}
					/>
					<FormField
						id="material"
						label={optional(t("form.material"))}
						placeholder={t("form.materialPlaceholder")}
						value={form.material}
						onChange={handleChange("material")}
						errors={errors}
					/>
				</div>

				<div className="garment-form-row">
					<div className="field">
						<label className="field-label" htmlFor="primaryColor">
							{t("form.primaryColor")}
						</label>
						<div className="garment-form-color">
							<input
								id="primaryColor"
								type="color"
								className="garment-form-swatch"
								value={form.primaryColor}
								onChange={handleChange("primaryColor")}
							/>
							<span className="garment-form-hex">{form.primaryColor}</span>
						</div>
						<ValidationField field="primaryColor" errors={errors} />
					</div>

					<div className="field">
						<label className="garment-form-check">
							<input
								type="checkbox"
								checked={form.hasSecondaryColor}
								onChange={(e) => setField("hasSecondaryColor", e.target.checked)}
							/>
							{t("form.hasSecondaryColor")}
						</label>
						{form.hasSecondaryColor && (
							<div className="garment-form-color">
								<input
									id="secondaryColor"
									type="color"
									className="garment-form-swatch"
									aria-label={t("form.secondaryColor")}
									value={form.secondaryColor}
									onChange={handleChange("secondaryColor")}
								/>
								<span className="garment-form-hex">{form.secondaryColor}</span>
							</div>
						)}
						<ValidationField field="secondaryColor" errors={errors} />
					</div>
				</div>

				<div className="garment-form-row is-three">
					<SelectField
						id="pattern"
						label={t("form.pattern")}
						value={form.pattern}
						onChange={(e) => setField("pattern", e.target.value as Pattern)}
						errors={errors}
					>
						{Object.values(Pattern).map((pattern) => (
							<option key={pattern} value={pattern}>
								{t(`pattern.${pattern}`)}
							</option>
						))}
					</SelectField>

					<SelectField
						id="fit"
						label={t("form.fit")}
						value={form.fit}
						onChange={(e) => setField("fit", e.target.value as Fit)}
						errors={errors}
					>
						{Object.values(Fit).map((fit) => (
							<option key={fit} value={fit}>
								{t(`fit.${fit}`)}
							</option>
						))}
					</SelectField>

					<SelectField
						id="season"
						label={t("form.season")}
						value={form.season}
						onChange={(e) => setField("season", e.target.value as Season)}
						errors={errors}
					>
						{Object.values(Season).map((season) => (
							<option key={season} value={season}>
								{t(`season.${season}`)}
							</option>
						))}
					</SelectField>
				</div>

				<div className="field">
					<span className="field-label">{t("form.formality")}</span>
					<div className="garment-form-formality">
						<FormalityDots
							value={form.formality}
							onChange={(level) => setField("formality", level)}
							label={t("form.formality")}
							fillUpTo
						/>
						<span className="garment-form-formality-name">
							{form.formality ? t(`formality.${form.formality}`) : t("form.formalityNone")}
						</span>
					</div>
					<ValidationField field="formality" errors={errors} />
				</div>

				<div className="field">
					<label className="field-label" htmlFor="careNotes">
						{optional(t("form.careNotes"))}
					</label>
					<textarea
						id="careNotes"
						className="input garment-form-textarea"
						rows={3}
						placeholder={t("form.careNotesPlaceholder")}
						value={form.careNotes}
						onChange={handleChange("careNotes")}
					/>
					<ValidationField field="careNotes" errors={errors} />
				</div>
			</section>

			<div className="form-actions garment-form-actions">
				<KeyButton
					type="submit"
					text={isSubmitting ? submittingText : submitText}
					disabled={isSubmitting}
				/>
				{cancelTo && (
					<div className="garment-form-cancel">
						<ChipButton text={t("form.cancel")} variant="ghost" to={cancelTo} />
					</div>
				)}
			</div>
		</form>
	)
}

export default GarmentForm
