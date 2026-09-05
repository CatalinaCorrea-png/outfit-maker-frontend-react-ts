import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"
import NavBar from "../components/NavBar/NavBar"
import Loader from "../components/Loader/Loader"

const PrivateLayer = () => {
	const { user, isInitializing } = useAuth()

	if(isInitializing) return <Loader fullScreen />
	if (!user) return <Navigate to="/login" replace />

  return (
		<div>
			<NavBar />
			<Outlet />
		</div>
  )
}

export default PrivateLayer