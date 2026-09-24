import type { ButtonHTMLAttributes } from 'react'
import "./keyButton.css"

type KeyButtonProps = {
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  text?: string;
  onClick?: () => void;
  // Mientras se envía un formulario: evita el doble click y el doble request
  disabled?: boolean;
}

const KeyButton = ({ type = 'button', text = 'Button', onClick, disabled = false }: KeyButtonProps) => {
  return (
    <div className="d3warpper">
        <div className="cover">
            <button className="button" type={type} onClick={onClick} disabled={disabled} aria-busy={disabled}>
                {text}
            </button>
        </div>
    </div>
  )
}

export default KeyButton
