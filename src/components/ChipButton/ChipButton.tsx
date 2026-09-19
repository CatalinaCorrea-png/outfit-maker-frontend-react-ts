import type { ButtonHTMLAttributes } from 'react'
import { NavLink } from 'react-router'
import "./chipButton.css"

type ChipButtonProps = {
    text: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    onClick?: () => void;
    // solid = acción principal (rosa), ghost = secundaria (papel)
    variant?: "solid" | "ghost";
    // Si viene, se renderiza como link: así andan el ctrl+click,
    // el "abrir en pestaña nueva" y el botón de atrás del navegador.
    to?: string;
}

const ChipButton = ({ text, type = 'button', onClick, variant = "solid", to }: ChipButtonProps) => {
  const className = `chip-button is-${variant}`

  if (to) {
    return (
      <NavLink to={to} className={className} onClick={onClick}>
          {text}
      </NavLink>
    )
  }

  return (
    <button className={className} type={type} onClick={onClick}>
        {text}
    </button>
  )
}

export default ChipButton
