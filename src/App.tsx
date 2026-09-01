import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
// va después del css de toastify: pisa sus variables de :root
import "./styles/toast.css"
import AppRouter from './router/AppRouter'

function App() {

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} />
      <AppRouter />
    </>
  )
}

export default App
