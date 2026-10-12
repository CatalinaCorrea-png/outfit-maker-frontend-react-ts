import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import ChipButton from "../ChipButton/ChipButton"
import Polaroid, { type TapeColor } from "../Polaroid/Polaroid"
import ValidationField from "../ValidationField/ValidationField"
import type { ValidationMessage } from "../ValidationField/ValidationMessage"
import "../FormField/formField.css"
import "./photoPicker.css"

// La foto de una cara y la URL de su preview.
// file = foto nueva, elegida acá (la preview es un object URL local, todavía no se subió).
// file null = la foto que la prenda ya tiene en el server (la preview es su URL).
export type PhotoSelection = {
  file: File | null
  previewUrl: string
}

type PhotoPickerProps = {
  id: string
  label: string
  // Epígrafe de la polaroid ("adelante", "atrás")
  caption: string
  photo: PhotoSelection | null
  onChange: (photo: PhotoSelection | null) => void
  errors: ValidationMessage[]
  tape?: TapeColor
  tilt?: number
  // Nombre del campo en los ValidationMessage. Por defecto coincide con el id.
  field?: string
}

/* Elegir una cara de la prenda, con su preview en una polaroid.
   La URL de preview se crea en el handler (crearla en el render rompe la regla de
   pureza de react-hooks) y se libera en el cleanup de un efecto, que corre cuando la
   foto cambia, cuando el form se resetea y al salir de la pantalla. */
const PhotoPicker = ({
  id,
  label,
  caption,
  photo,
  onChange,
  errors,
  tape,
  tilt,
  field = id,
}: PhotoPickerProps) => {
  const { t } = useTranslation("garments")
  const inputRef = useRef<HTMLInputElement>(null)

  // Solo cleanup, sin setState. Solo se revocan las URLs que creó este componente
  // (fotos nuevas): la de una foto del server no es un object URL. Una foto nueva
  // siempre llega después del montaje, así que el doble montaje de StrictMode no
  // revoca una preview en uso.
  useEffect(() => () => {
    if (photo?.file) URL.revokeObjectURL(photo.previewUrl)
  }, [photo])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Vacía el input: así volver a elegir el mismo archivo dispara onChange de nuevo
    e.target.value = ""
    if (!file) return

    onChange({ file, previewUrl: URL.createObjectURL(file) })
  }

  return (
    <div className="field photo-picker">
      <span className="field-label">{label}</span>

      <Polaroid
        caption={caption}
        tape={tape}
        tilt={tilt}
        background={photo ? "paper" : "dots"}
        className="photo-picker-polaroid"
      >
        {photo ? (
          <img className="photo-picker-img" src={photo.previewUrl} alt={caption} />
        ) : (
          <span className="photo-picker-empty">{t("form.photos.empty")}</span>
        )}
      </Polaroid>

      <div className="photo-picker-actions">
        <ChipButton
          text={photo ? t("form.photos.change") : t("form.photos.choose")}
          variant={photo ? "ghost" : "solid"}
          onClick={() => inputRef.current?.click()}
        />
        {photo && <ChipButton text={t("form.photos.remove")} variant="ghost" onClick={() => onChange(null)} />}
      </div>

      {/* Sin HEIC en accept: el iPhone convierte solo a JPEG al elegir la foto */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleFile}
      />
      <ValidationField field={field} errors={errors} />
    </div>
  )
}

export default PhotoPicker
