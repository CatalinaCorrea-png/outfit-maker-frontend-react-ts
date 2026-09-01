import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"
import NavBar from "../components/NavBar/NavBar"

const PrivateLayer = () => {
	const { user } = useAuth()

	if (!user) return <Navigate to="/login" replace />

  return (
		<div>
			<NavBar />
			<Outlet />
		</div>
  )
}

export default PrivateLayer