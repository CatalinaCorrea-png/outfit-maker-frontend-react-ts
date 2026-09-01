import "./inputField.css"

type InputProps = {
    type: string;
    id: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ type, id, value, placeholder, onChange }: InputProps) => {
  return (
    <input
        type={type}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="input"
    />
  )
}

export default InputField