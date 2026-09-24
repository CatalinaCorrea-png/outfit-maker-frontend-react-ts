import type { ReactNode } from "react"
import { Link } from "react-router"
import BrandLink from "../BrandLink/BrandLink"
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher"
import GitHubLink from "../GitHubLink/GitHubLink"
import NotebookCard from "../NotebookCard/NotebookCard"
import "./authLayout.css"

type AuthLayoutProps = {
  // El formulario de la pantalla
  children: ReactNode
  subtitle: string
  sticker: string
  footer: string
  // "¿No tenés cuenta? Creá una": el salto entre login y registro
  switchPrompt: string
  switchLinkText: string
  switchTo: string
}

/* Marco de las pantallas públicas de acceso (login y registro):
   marca e idioma arriba, la hoja de cuaderno al centro y el GitHub abajo. */
const AuthLayout = ({
  children,
  subtitle,
  sticker,
  footer,
  switchPrompt,
  switchLinkText,
  switchTo,
}: AuthLayoutProps) => (
  <main className="auth-screen">
    <div className="auth-brand">
      <BrandLink />
    </div>
    <div className="auth-lang">
      <LanguageSwitcher />
    </div>

    <NotebookCard tape="★ 2 0 0 0 ★" sticker={sticker}>
      <header className="auth-header">
        <h1 className="auth-title">
          outfit <em>maker</em>
        </h1>
        <p className="auth-subtitle">{subtitle}</p>
      </header>

      {children}

      <p className="auth-switch">
        {switchPrompt} <Link to={switchTo} className="auth-switch-link">{switchLinkText}</Link>
      </p>
      <p className="auth-footer">{footer}</p>
    </NotebookCard>

    <div className="auth-aside">
      <GitHubLink />
    </div>
  </main>
)

export default AuthLayout
