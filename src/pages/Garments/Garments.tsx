import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { Garment } from "../../domain/Garment"
import ChipButton from "../../components/ChipButton/ChipButton"
import GarmentCard from "../../components/GarmentCard/GarmentCard"
import { garmentService } from "../../services/garmentService"
import { useOnInit } from "../../hooks/useOnInit"
import { showToast } from "../../utils/toast"
import "./garments.css"
import type { GarmentFilters } from "../../dto/GarmentDTO"
import Filters, { type SortOption } from "../../components/GarmentFilters/GarmentFilters"

const initialFilters: GarmentFilters = {
  category: null,
  name: null,
  brand: null,
  pattern: null,
  formality: null,
  season: null,
  active: null,
  page: 0,
  pageSize: 12,
  sortBy: "name",
  ascending: true
}

const initialSortOptions: SortOption[] = [
  { label: "filters.sortOptName", value: "name", current: true },
  { label: "filters.sortOptCreatedAt", value: "createdAt", current: false },
]

const Garments = () => {
  const { t } = useTranslation("common")
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
    <main className="garments">
      <Filters 
      initialFilters={initialFilters} 
      initialSortOptions={initialSortOptions} 
      filters={filters} 
      setFilters={setFilters} 
      sendFilters={getFilteredGarments}
      />
      <div className="garments-content">
        <div className="garments-actions">
          <ChipButton text={t("nav.addGarment")} to="/add-garment" />
        </div>

        {garments.length === 0 ? (
          <p className="garments-empty">todavía no hay prendas en el placard ✧</p>
        ) : (
          <div className="garments-grid">
            {garments.map((garment: Garment) => (
              <GarmentCard key={garment.id} garment={garment} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Garments
