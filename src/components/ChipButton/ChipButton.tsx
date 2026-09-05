import type { ButtonHTMLAttributes } from 'react'
import "./chipButton.css"

type ChipButtonProps = {
    text: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    onClick?: () => void;
    // solid = acción principal (rosa), ghost = secundaria (papel)
    variant?: "solid" | "ghost";
}

const ChipButton = ({ text, type = 'button', onClick, variant = "solid" }: ChipButtonProps) => {
  return (
    <button className={`chip-button is-${variant}`} type={type} onClick={onClick}>
        {text}
    </button>
  )
}

export default ChipButton
