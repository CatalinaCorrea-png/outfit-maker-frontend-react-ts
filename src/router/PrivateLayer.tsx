import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"

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