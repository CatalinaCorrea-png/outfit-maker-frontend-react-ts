import { Navigate, Route, Routes } from "react-router"
import PrivateLayer from './PrivateLayer'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Garments from '../pages/Garments/Garments'
import { useAuth } from "../context/AuthContext"
import AddGarment from "../pages/AddGarment/AddGarment"

const AppRouter = () => {
	const { user } = useAuth()
  return (
    <Routes>
		{/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={"/garments"} replace /> : <Login />}/>
        <Route path="/register" element={user ? <Navigate to={"/garments"} replace /> : <Register />}/>

			{/* Private Routes */}
			<Route element={<PrivateLayer />}>
				<Route path="/garments" element={<Garments />} />
				<Route path="/add-garment" element={<AddGarment />} />
			</Route>
		</Routes>
  )
}

export default AppRouter
