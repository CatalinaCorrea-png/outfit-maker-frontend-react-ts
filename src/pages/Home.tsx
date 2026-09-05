import { useState } from "react"
import type { Garment } from "../domain/Garment"
import GarmentCard from "../components/GarmentCard/GarmentCard"
import { garmentService } from "../services/garmentService"
import { useOnInit } from "../hooks/useOnInit"
import { showToast } from "../utils/toast"
import "./home.css"
import type { GarmentFilters } from "../dto/GarmentDTO"

const initialFilters: GarmentFilters = {
  category: null,
  name: null,
  brand: null,
  primaryColor: null,
  secondaryColor: null,
  pattern: null,
  material: null,
  formality: null,
  fit: null,
  season: null,
  active: null,
  page: 0,
  pageSize: 12,
  sortBy: "name",
  ascending: true
}

const Home = () => {
  const [garments, setGarments] = useState<Garment[]>([])
  const [filters, setFilters] = useState<GarmentFilters>(initialFilters)

  const getFilteredGarments = async (filters: GarmentFilters) => {
    try {
      const response = await garmentService.getGarments(filters)
      setGarments(response)
    } catch(error) {
      showToast.httpError(error)
    }
  }

  useOnInit(() => {
    getFilteredGarments(initialFilters)
  })

  return (
    <main className="home">
      {garments.length === 0 ? (
        <p className="home-empty">todavía no hay prendas en el placard ✧</p>
      ) : (
        <div className="home-grid">
          {garments.map((garment: Garment) => (
            <GarmentCard key={garment.id} garment={garment} />
          ))}
        </div>
      )}
    </main>
  )
}

export default Home
