import { Navigate, Route, Routes } from "react-router"
import PrivateLayer from './PrivateLayer'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Garments from '../pages/Garments'
import { useAuth } from "../context/AuthContext"

const AppRouter = () => {
	const { user } = useAuth()
  return (
    <Routes>
		{/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={"/garments"} replace /> : <Login />}/>

			{/* Private Routes */}
			<Route element={<PrivateLayer />}>
				<Route path="/garments" element={<Garments />} />
			</Route>
		</Routes>
  )
}

export default AppRouter
