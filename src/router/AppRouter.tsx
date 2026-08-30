import { Navigate, Route, Routes } from "react-router"
import PrivateLayer from './PrivateLayer'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { useAuth } from "../context/AuthContext"

const AppRouter = () => {
	const { user } = useAuth()
  return (
    <Routes>
			{/* Rutas públicas - siempre disponibles */}
        <Route path="/login" element={user ? <Navigate to={"/"} replace /> : <Login />}/>

			{/* Rutas privadas */}
			<Route element={<PrivateLayer />}>
				<Route path="/" element={<Home />} />
			</Route>
		</Routes>
  )
}

export default AppRouter