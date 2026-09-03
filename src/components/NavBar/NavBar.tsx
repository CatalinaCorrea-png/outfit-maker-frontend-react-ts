import { Link } from "react-router"
import LogoutButton from "../LogoutButton/LogoutButton"


const NavBar = () => {
  
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div>
        <h3>OutfitMaker ✧</h3>
      </div>
      <div className="flex items-center">
        <Link to="/" className="mr-4 hover:underline">Wardrobe</Link>
        <Link to="/outfits" className="mr-4 hover:underline">Outfits</Link>
        <Link to="/categories" className="mr-4 hover:underline">Categories</Link>
        <Link to="/create-outfit" className="mr-4 hover:underline">Create An Outfit</Link>
        <Link to="/add-garment" className="mr-4 hover:underline">Add Garment</Link>

        <div className="w-30 flex flex-row-reverse"><LogoutButton /></div>
      </div>
    </div>
  )
}

export default NavBar