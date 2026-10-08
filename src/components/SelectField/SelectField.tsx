import type { ReactNode } from "react"
import ValidationField from "../ValidationField/ValidationField"
import type { ValidationMessage } from "../ValidationField/ValidationMessage"
// .field / .field-label y el look de .input
import "../FormField/formField.css"
import "../InputField/inputField.css"
import "./selectField.css"

type SelectFieldProps = {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  errors: ValidationMessage[]
  // Los <option>: cada pantalla arma los suyos (categorías, enums traducidos)
  children: ReactNode
  disabled?: boolean
  // Nombre del campo en los ValidationMessage. Por defecto coincide con el id.
  field?: string
}

/* Igual que FormField, pero con un select: etiqueta, select y mensaje de error.
   El select usa la clase .input para verse igual que los campos de texto. */
const SelectField = ({
  id,
  label,
  value,
  onChange,
  errors,
  children,
  disabled = false,
  field = id,
}: SelectFieldProps) => (
  <div className="field">
    <label className="field-label" htmlFor={id}>
      {label}
    </label>
    <select id={id} className="input select" value={value} onChange={onChange} disabled={disabled}>
      {children}
    </select>
    <ValidationField field={field} errors={errors} />
  </div>
)

export default SelectField
