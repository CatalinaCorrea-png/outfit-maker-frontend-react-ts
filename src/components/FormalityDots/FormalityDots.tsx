import { useTranslation } from "react-i18next"
import "./formalityDots.css"

// as const para que el nivel sea 1|2|3|4|5 y tipe contra las claves formality.*
const FORMALITY_LEVELS = [1, 2, 3, 4, 5] as const

export type FormalityLevel = (typeof FORMALITY_LEVELS)[number]

type FormalityDotsProps = {
  // null (o 0) = ninguno elegido
  value: number | null
  onChange: (level: FormalityLevel | null) => void
  // Nombre del grupo para el lector de pantalla
  label: string
  // true: pinta hasta el nivel elegido, como la card ("hasta acá").
  // false: solo el elegido, para el filtro, que busca ese nivel exacto.
  fillUpTo?: boolean
}

/* Los 5 puntitos de formalidad de la card, clickeables. Volver a clickear el
   nivel elegido lo limpia. Los usan el filtro y el formulario de alta. */
const FormalityDots = ({ value, onChange, label, fillUpTo = false }: FormalityDotsProps) => {
  const { t } = useTranslation("garments")

  const isOn = (level: number) =>
    value !== null && (fillUpTo ? level <= value : level === value)

  return (
    <div className="formality-dots" role="group" aria-label={label}>
      {FORMALITY_LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          className={`formality-dot ${isOn(level) ? "is-on" : ""}`}
          onClick={() => onChange(value === level ? null : level)}
          aria-pressed={value === level}
          aria-label={t(`formality.${level}`)}
          title={t(`formality.${level}`)}
        />
      ))}
    </div>
  )
}

export default FormalityDots
