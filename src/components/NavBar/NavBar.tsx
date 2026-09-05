import { NavLink } from "react-router"
import { useTranslation } from "react-i18next"
import LogoutButton from "../LogoutButton/LogoutButton"
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher"
import { getName } from "../../context/AuthContext"
import "./navBar.css"

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "navbar-link is-active" : "navbar-link"

const NavBar = () => {
  const { t } = useTranslation("common")
  const userName = getName()
  return (
    <nav className="navbar">
      <span className="navbar-brand">{`${userName}'s`} outfit maker ✧</span>

      <div className="navbar-links">
        {/* end: sin esto "/" queda activo en todas las rutas */}
        <NavLink to="/" end className={linkClass}>{t("nav.wardrobe")}</NavLink>
        <NavLink to="/outfits" className={linkClass}>{t("nav.outfits")}</NavLink>
        <NavLink to="/categories" className={linkClass}>{t("nav.categories")}</NavLink>
        <NavLink to="/create-outfit" className={linkClass}>{t("nav.createOutfit")}</NavLink>
        <NavLink to="/add-garment" className={linkClass}>{t("nav.addGarment")}</NavLink>
      </div>

      <div className="navbar-tools">
        <LanguageSwitcher />
        <div className="navbar-logout"><LogoutButton /></div>
      </div>
    </nav>
  )
}

export default NavBar
