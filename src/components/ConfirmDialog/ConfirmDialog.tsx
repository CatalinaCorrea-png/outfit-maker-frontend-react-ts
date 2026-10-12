import { useEffect, useId, useRef } from "react"
import { FocusTrap } from "focus-trap-react"
import ChipButton from "../ChipButton/ChipButton"
import "./confirmDialog.css"

type ConfirmDialogProps = {
  title: string
  message: string
  confirmText: string
  cancelText: string
  // Mientras espera al server: los botones quedan quietos y Escape no cierra
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/* Confirmación para acciones que no se pueden deshacer (ej: eliminar una prenda).
   Una nota pegada sobre la pantalla, con el foco atrapado adentro: arranca en
   "Cancelar" para que un Enter apurado no confirme. Escape cancela. */
const ConfirmDialog = ({
  title,
  message,
  confirmText,
  cancelText,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const titleId = useId()
  const messageId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  // La página de atrás no scrollea mientras el diálogo está abierto
  useEffect(() => {
    document.body.classList.add("overflow-hidden")
    return () => document.body.classList.remove("overflow-hidden")
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !busy) onCancel()
  }

  return (
    <FocusTrap
      focusTrapOptions={{
        // Escape lo maneja el diálogo: así respeta "busy" y no depende de desactivar el trap
        escapeDeactivates: false,
        initialFocus: () => dialogRef.current?.querySelector<HTMLElement>(".confirm-dialog-cancel button") ?? false,
      }}
    >
      <div className="confirm-dialog-backdrop" onKeyDown={handleKeyDown}>
        <div
          ref={dialogRef}
          className="confirm-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={messageId}
        >
          <h2 id={titleId} className="confirm-dialog-title">{title}</h2>
          <p id={messageId} className="confirm-dialog-message">{message}</p>

          <div className="confirm-dialog-actions">
            <span className="confirm-dialog-cancel">
              <ChipButton text={cancelText} variant="ghost" onClick={onCancel} disabled={busy} />
            </span>
            <ChipButton text={confirmText} variant="danger" onClick={onConfirm} disabled={busy} />
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}

export default ConfirmDialog
