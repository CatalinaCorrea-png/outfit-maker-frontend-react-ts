import type { ButtonHTMLAttributes } from 'react'
import { NavLink } from 'react-router'
import "./chipButton.css"

type ChipButtonProps = {
    text: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    onClick?: () => void;
    // solid = acción principal (rosa), ghost = secundaria (papel),
    // danger = lo que no se puede deshacer (ej: eliminar)
    variant?: "solid" | "ghost" | "danger";
    // Si viene, se renderiza como link: así andan el ctrl+click,
    // el "abrir en pestaña nueva" y el botón de atrás del navegador.
    to?: string;
    // Solo para el botón (ej: mientras espera la respuesta del server)
    disabled?: boolean;
}

const ChipButton = ({ text, type = 'button', onClick, variant = "solid", to, disabled = false }: ChipButtonProps) => {
  const className = `chip-button is-${variant}`

  if (to) {
    return (
      <NavLink to={to} className={className} onClick={onClick}>
          {text}
      </NavLink>
    )
  }

  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
        {text}
    </button>
  )
}

export default ChipButton
