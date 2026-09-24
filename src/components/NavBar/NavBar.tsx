import { useEffect, useRef } from "react"
import { Link, NavLink } from "react-router"
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
  const navRef = useRef<HTMLElement>(null)

  // La navbar cambia de alto cuando los links pasan a otro renglón, así que
  // publica su altura y lo que se pega abajo (los filtros) la lee de ahí.
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const publishHeight = () => {
      document.documentElement.style.setProperty("--navbar-h", `${nav.offsetHeight}px`)
    }

    publishHeight()
    const observer = new ResizeObserver(publishHeight)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="navbar" ref={navRef}>
      {/* La marca vuelve a la landing, donde está la guía de uso */}
      <Link to="/" className="navbar-brand">{`${userName}'s`} outfit maker ✧</Link>

      <div className="navbar-links">
        <NavLink to="/garments" className={linkClass}>{t("nav.wardrobe")}</NavLink>
        <NavLink to="/outfits" className={linkClass}>{t("nav.outfits")}</NavLink>
        <NavLink to="/categories" className={linkClass}>{t("nav.categories")}</NavLink>
        <NavLink to="/create-outfit" className={linkClass}>{t("nav.createOutfit")}</NavLink>
      </div>

      <div className="navbar-tools">
        <LanguageSwitcher />
        <div className="navbar-logout"><LogoutButton /></div>
      </div>
    </nav>
  )
}

export default NavBar
