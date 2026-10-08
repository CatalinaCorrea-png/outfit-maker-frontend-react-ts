import { useRef, useState } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import NotebookCard from "../../components/NotebookCard/NotebookCard"
import FormField from "../../components/FormField/FormField"
import SelectField from "../../components/SelectField/SelectField"
import FormalityDots, { type FormalityLevel } from "../../components/FormalityDots/FormalityDots"
import PhotoPicker, { type PhotoSelection } from "../../components/PhotoPicker/PhotoPicker"
import KeyButton from "../../components/KeyButton/KeyButton"
import ValidationField from "../../components/ValidationField/ValidationField"
import { ValidationMessage } from "../../components/ValidationField/ValidationMessage"
import { Garment } from "../../domain/Garment"
import { Pattern } from "../../domain/types/Pattern"
import { Fit } from "../../domain/types/Fit"
import { Season } from "../../domain/types/Season"
import type { CategoryJSON } from "../../dto/CategoryDTO"
import { categoryService } from "../../services/categoryService"
import { garmentService } from "../../services/garmentService"
import { useOnInit } from "../../hooks/useOnInit"
import { prepareImage, UnreadableImageError } from "../../utils/image"
import { showToast } from "../../utils/toast"
import "../../components/FormField/formField.css"
import "./addGarment.css"

type AddGarmentForm = {
	name: string
	category: string
	brand: string
	material: string
	primaryColor: string
	hasSecondaryColor: boolean
	secondaryColor: string
	pattern: Pattern
	fit: Fit
	season: Season
	formality: FormalityLevel | null
	careNotes: string
	front: PhotoSelection | null
	back: PhotoSelection | null
}

// Los colores arrancan con un valor porque el picker no puede quedar "vacío":
// lo que se ve en el swatch es lo que se guarda.
const emptyForm: AddGarmentForm = {
	name: "",
	category: "",
	brand: "",
	material: "",
	primaryColor: "#000000",
	hasSecondaryColor: false,
	secondaryColor: "#ffffff",
	pattern: Pattern.SOLID,
	fit: Fit.REGULAR,
	season: Season.ALL_SEASONS,
	formality: null,
	careNotes: "",
	front: null,
	back: null,
}

// Los campos que se escriben tal cual vienen del input
type TextKey = "name" | "category" | "brand" | "material" | "primaryColor" | "secondaryColor" | "careNotes"

type CategoriesStatus = "loading" | "ready" | "error"

// El form se traduce a la prenda del dominio, que es la que sabe validarse
const toGarment = (form: AddGarmentForm) =>
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

const AddGarment = () => {
	const { t } = useTranslation("garments")
	const [form, setForm] = useState<AddGarmentForm>(emptyForm)
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

	const setField = <K extends keyof AddGarmentForm>(key: K, value: AddGarmentForm[K]) =>
		setForm((prev) => ({ ...prev, [key]: value }))

	// Un solo handler para los campos de texto: la clave dice cuál actualizar
	const handleChange = (key: TextKey) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
			setField(key, e.target.value)

	// Achica la foto y genera la miniatura. Si el navegador no la puede leer
	// (ej: HEIC en Chrome), marca el campo de esa foto en vez de cortar todo.
	const preparePhoto = async (photo: PhotoSelection | null, field: string, garment: Garment) => {
		if (!photo) return null
		try {
			return await prepareImage(photo.file)
		} catch (error) {
			if (!(error instanceof UnreadableImageError)) throw error
			garment.addError(field, "validation.photoUnreadable")
			return null
		}
	}

	// No redirige: deja el form listo para cargar la próxima prenda.
	// Las previews las libera el PhotoPicker al cambiar su foto a null.
	const resetForm = () => {
		setForm(emptyForm)
		setErrors([])
		formRef.current?.querySelector<HTMLInputElement>("#name")?.focus()
	}

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isSubmitting) return

		const garment = toGarment(form)
		garment.validate()
		// Regla del formulario, no de la prenda: el bootstrap siembra prendas sin fotos
		if (!form.front) garment.addError("front", "validation.frontPhotoRequired")
		if (garment.errors.length > 0) {
			setErrors(garment.errors)
			return
		}

		setIsSubmitting(true)
		try {
			// 1. Preparar las dos fotos antes de enviar nada: si una no se puede leer, no viaja ninguna
			const frontImage = await preparePhoto(form.front, "front", garment)
			const backImage = await preparePhoto(form.back, "back", garment)
			if (!frontImage || garment.errors.length > 0) {
				setErrors(garment.errors)
				return
			}

			// 2. Datos y fotos en un solo request: o se guarda todo o no se guarda nada
			try {
				await garmentService.createGarment(garment.toCreateJSON(), { front: frontImage, back: backImage })
			} catch (error) {
				// El nombre repetido se muestra en su campo, no solo como toast
				if (axios.isAxiosError(error) && error.response?.data?.code === "GARMENT_ALREADY_EXISTS") {
					setErrors([new ValidationMessage("name", "validation.nameTaken")])
				} else {
					showToast.httpError(error, t("form.error"))
				}
				return
			}

			showToast.success(t("form.success"))
			resetForm()
		} finally {
			setIsSubmitting(false)
		}
	}

	const optional = (label: string) => `${label} ${t("form.optional")}`

	return (
		<main className="add-garment">
			<NotebookCard tape="★ new in ★" sticker="✧" className="add-garment-card">
				<header className="add-garment-header">
					<h1 className="add-garment-title">{t("form.title")}</h1>
					<p className="add-garment-subtitle">{t("form.subtitle")}</p>
				</header>

				<form ref={formRef} onSubmit={handleSubmit} className="add-garment-form" noValidate>
					<section className="add-garment-photos">
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

					<section className="add-garment-fields form-stack">
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

						<div className="add-garment-row">
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

						<div className="add-garment-row">
							<div className="field">
								<label className="field-label" htmlFor="primaryColor">
									{t("form.primaryColor")}
								</label>
								<div className="add-garment-color">
									<input
										id="primaryColor"
										type="color"
										className="add-garment-swatch"
										value={form.primaryColor}
										onChange={handleChange("primaryColor")}
									/>
									<span className="add-garment-hex">{form.primaryColor}</span>
								</div>
								<ValidationField field="primaryColor" errors={errors} />
							</div>

							<div className="field">
								<label className="add-garment-check">
									<input
										type="checkbox"
										checked={form.hasSecondaryColor}
										onChange={(e) => setField("hasSecondaryColor", e.target.checked)}
									/>
									{t("form.hasSecondaryColor")}
								</label>
								{form.hasSecondaryColor && (
									<div className="add-garment-color">
										<input
											id="secondaryColor"
											type="color"
											className="add-garment-swatch"
											aria-label={t("form.secondaryColor")}
											value={form.secondaryColor}
											onChange={handleChange("secondaryColor")}
										/>
										<span className="add-garment-hex">{form.secondaryColor}</span>
									</div>
								)}
								<ValidationField field="secondaryColor" errors={errors} />
							</div>
						</div>

						<div className="add-garment-row is-three">
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
							<div className="add-garment-formality">
								<FormalityDots
									value={form.formality}
									onChange={(level) => setField("formality", level)}
									label={t("form.formality")}
									fillUpTo
								/>
								<span className="add-garment-formality-name">
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
								className="input add-garment-textarea"
								rows={3}
								placeholder={t("form.careNotesPlaceholder")}
								value={form.careNotes}
								onChange={handleChange("careNotes")}
							/>
							<ValidationField field="careNotes" errors={errors} />
						</div>
					</section>

					<div className="form-actions add-garment-actions">
						<KeyButton
							type="submit"
							text={isSubmitting ? t("form.submitting") : t("form.submit")}
							disabled={isSubmitting}
						/>
					</div>
				</form>
			</NotebookCard>
		</main>
	)
}

export default AddGarment
