import type { CSSProperties, ReactNode } from "react"
import "./polaroid.css"

export type TapeColor = "pink" | "butter" | "mint" | "sky" | "lilac"
export type PhotoBackground = "plaid" | "dots" | "grid" | "stripes" | "paper"

type PolaroidProps = {
  // Lo que va "revelado" en la foto: una imagen, un dibujo, lo que sea
  children: ReactNode
  caption: ReactNode
  // Texto chico debajo del epígrafe, como lo que se escribe atrás de la foto
  note?: ReactNode
  tape?: TapeColor
  background?: PhotoBackground
  // Grados de inclinación: cada foto pegada a mano queda un poco torcida
  tilt?: number
  className?: string
}

const Polaroid = ({
  children,
  caption,
  note,
  tape = "butter",
  background = "paper",
  tilt = 0,
  className = "",
}: PolaroidProps) => {
  const style = { "--tilt": `${tilt}deg` } as CSSProperties

  return (
    <figure className={`polaroid ${className}`} style={style}>
      <span className={`polaroid-tape is-${tape}`} aria-hidden="true" />
      <div className={`polaroid-photo is-${background}`}>{children}</div>
      <figcaption className="polaroid-caption">{caption}</figcaption>
      {note && <p className="polaroid-note">{note}</p>}
    </figure>
  )
}

export default Polaroid
