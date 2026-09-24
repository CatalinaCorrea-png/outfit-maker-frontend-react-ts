import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react"
import InputField from "../InputField/InputField"
import ValidationField from "../ValidationField/ValidationField"
import type { ValidationMessage } from "../ValidationField/ValidationMessage"
import "./formField.css"

type FormFieldProps = {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: ValidationMessage[]
  type?: HTMLInputTypeAttribute
  placeholder?: string
  autoComplete?: HTMLInputAutoCompleteAttribute
  // Nombre del campo en los ValidationMessage. Por defecto coincide con el id.
  field?: string
}

/* Un campo de formulario completo: etiqueta, input y mensaje de error.
   Para campos que no son un input de texto (selects, puntitos), usá las
   clases .field y .field-label de formField.css con tu propio control. */
const FormField = ({
  id,
  label,
  value,
  onChange,
  errors,
  type = "text",
  placeholder,
  autoComplete,
  field = id,
}: FormFieldProps) => (
  <div className="field">
    <label className="field-label" htmlFor={id}>
      {label}
    </label>
    <InputField
      type={type}
      id={id}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={onChange}
    />
    <ValidationField field={field} errors={errors} />
  </div>
)

export default FormField
