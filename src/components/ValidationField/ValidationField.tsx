import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ValidationMessage } from "./ValidationMessage"
import "./validationField.css"

const ValidationField = ({ field, errors }: { field: string; errors: ValidationMessage[] }) => {
  const { t } = useTranslation("errors")

  // Guarda cuál tanda de errores ya venció, no el texto.
  const [expired, setExpired] = useState<ValidationMessage[] | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setExpired(errors), 5000)
    return () => clearTimeout(timer)
  }, [errors])

  // Derivado en render: si cambia el idioma, se retraduce al instante.
  const message =
    errors === expired
      ? ""
      : errors
          .filter((_) => _.field === field)
          .map((_) => t(_.message, _.params))
          .join(". ")

    return (
      <>
        {!!message && (
          <div className="error" data-testid={"error-field-" + field}>
            {message}
          </div>
        )}
      </>
    )
  }

export default ValidationField
