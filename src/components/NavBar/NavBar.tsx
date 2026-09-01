import { useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext"


const NavBar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }
  
  return (
    <div>
      <div>NavBar</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default NavBar