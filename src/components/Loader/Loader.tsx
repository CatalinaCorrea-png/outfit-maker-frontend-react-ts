import "./loader.css"

type LoaderProps = {
    // Opcional: si no viene, el loader es solo visual (los puntitos ya son aria-hidden)
    text?: string;
    // Para usarlo como pantalla completa, ej: mientras se restaura la sesión
    fullScreen?: boolean;
}

const Loader = ({ text, fullScreen = false }: LoaderProps) => {
  return (
    <div
        className={`loader ${fullScreen ? "is-fullscreen" : ""}`}
        role="status"
        aria-busy="true"
    >
        <div className="loader-dots" aria-hidden="true">
            <span className="loader-dot" />
            <span className="loader-dot" />
            <span className="loader-dot" />
        </div>
        {text && <p className="loader-text">{text}</p>}
    </div>
  )
}

export default Loader
