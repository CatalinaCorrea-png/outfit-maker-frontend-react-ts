import { Link } from "react-router"
import "./brandLink.css"

// La marca de las pantallas públicas (landing y login): siempre vuelve a la landing.
// La NavBar tiene la suya, personalizada con el nombre del usuario.
const BrandLink = () => (
  <Link to="/" className="brand-link">outfit maker ✧</Link>
)

export default BrandLink
