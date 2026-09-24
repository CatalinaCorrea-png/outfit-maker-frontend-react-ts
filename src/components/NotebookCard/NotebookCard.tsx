import type { ReactNode } from "react"
import "./notebookCard.css"

type NotebookCardProps = {
  children: ReactNode
  // Texto de la cinta washi pegada en la esquina (opcional)
  tape?: string
  // Sticker redondo al costado del título (opcional)
  sticker?: string
  className?: string
}

/* Hoja de cuaderno rayada, con margen rosa y perforaciones de carpeta.
   Es la "tarjeta" de las pantallas con formulario. */
const NotebookCard = ({ children, tape, sticker, className = "" }: NotebookCardProps) => (
  <div className={`notebook-card ${className}`}>
    <div className="notebook-holes" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    {tape && <span className="notebook-tape" aria-hidden="true">{tape}</span>}
    {sticker && <span className="notebook-sticker" aria-hidden="true">{sticker}</span>}
    {children}
  </div>
)

export default NotebookCard
