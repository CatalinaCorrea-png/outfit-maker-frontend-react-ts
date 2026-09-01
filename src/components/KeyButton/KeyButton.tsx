import type { ButtonHTMLAttributes } from 'react'
import "./keyButton.css"

type KeyButtonProps = {
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  text?: string;
}

const KeyButton = ({ type = 'button', text = 'Button' }: KeyButtonProps) => {
  return (
    <div className="d3warpper">
        <div className="cover">
            <button className="button" type={type}>
                {text}
            </button>
        </div>
    </div>
  )
}

export default KeyButton