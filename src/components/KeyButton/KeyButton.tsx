import type { ButtonHTMLAttributes } from 'react'
import "./keyButton.css"

type KeyButtonProps = {
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  text?: string;
  onClick?: () => void;
}

const KeyButton = ({ type = 'button', text = 'Button', onClick }: KeyButtonProps) => {
  return (
    <div className="d3warpper">
        <div className="cover">
            <button className="button" type={type} onClick={onClick}>
                {text}
            </button>
        </div>
    </div>
  )
}

export default KeyButton
