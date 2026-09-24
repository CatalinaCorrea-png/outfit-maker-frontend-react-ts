import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react"
import "./inputField.css"

type InputProps = {
    type: HTMLInputTypeAttribute;
    id: string;
    value: string;
    placeholder?: string;
    // Le dice al navegador qué es el campo, así el gestor de contraseñas
    // autocompleta el login y propone una clave nueva en el registro
    autoComplete?: HTMLInputAutoCompleteAttribute;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ type, id, value, placeholder, autoComplete, onChange }: InputProps) => {
  return (
    <input
        type={type}
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={onChange}
        className="input"
    />
  )
}

export default InputField
