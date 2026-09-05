import { useState } from 'react'
import type { ParseKeys } from 'i18next'
import type { GarmentFilters } from '../../dto/GarmentDTO'
import './garmentFilters.css'
import ChipButton from '../ChipButton/ChipButton'
import { useTranslation } from 'react-i18next'
import InputField from '../InputField/InputField'
import { Pattern } from '../../domain/types/Pattern'
import { Season } from '../../domain/types/Season'

export type SortOption = {
    label: ParseKeys<"garments">,
    value: string,
    current: boolean
}

type GarmentFiltersProps = {
    initialFilters: GarmentFilters,
    initialSortOptions: SortOption[],
    filters: GarmentFilters,
    setFilters: React.Dispatch<React.SetStateAction<GarmentFilters>>,
    // Recibe los filtros a mandar: setFilters es asíncrono, así que el estado
    // del closure todavía tiene el valor viejo cuando disparamos la búsqueda.
    sendFilters: (filtersToSend: GarmentFilters) => void
}

// as const para que el nivel sea 1|2|3|4|5 y tipe contra las claves formality.*
const FORMALITY_LEVELS = [1, 2, 3, 4, 5] as const

// Los que cuentan para el globito del botón: el orden y la paginación no son filtros
const FILTER_KEYS = ["category", "name", "brand", "pattern", "season", "formality", "active"] as const

const Filters = ({ initialFilters, initialSortOptions, filters, setFilters, sendFilters }: GarmentFiltersProps) => {
    const { t } = useTranslation("garments")

    const [isOpen, setIsOpen] = useState(false)
    const [sortingOptions, setSortingOptions] = useState(initialSortOptions.map((option) => ({
        ...option,
        current: option.value === initialFilters.sortBy,
      })))

    const activeCount = FILTER_KEYS.filter((key) => {
        const value = filters[key]
        return value !== null && value !== ""
    }).length

    //* ==== FILTERS UPDATE ====
    const updateFilter = <K extends keyof GarmentFilters>(
        key: K,
        value: GarmentFilters[K],
    ): GarmentFilters => {
        setFilters((prev) => ({
        ...prev,
        [key]: value,
        }))
        return { ...filters, [key]: value } // devuelvo los filtros mas actualizados
    }

    // Volver a clickear el nivel que ya estaba seleccionado limpia el filtro
    const toggleFormality = (level: number) => {
        updateFilter("formality", filters.formality === level ? null : level)
    }

    //* ==== SORTING ====
    // Solo toca estado: devuelve los filtros ya con el orden nuevo
    const updateSortOptions = (selectedOption: string) => {
        setSortingOptions((prev) =>
        prev.map((option) => ({
            ...option,
            current: option.value === selectedOption,
        })),
        )
        return updateFilter("sortBy", selectedOption)
    }

    // El orden no espera al submit: cambiarlo ya dispara la búsqueda
    const handleSortChange = (selectedOption: string) => {
        sendFilters(updateSortOptions(selectedOption))
    }

    const toggleSortDirection = () => {
        sendFilters(updateFilter("ascending", !filters.ascending))
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        sendFilters(filters)
    }

    // Limpiar es otro submit: borra los filtros y trae el placard completo
    const handleClearFilters = () => {
        updateSortOptions(initialSortOptions[0].value) // resetea la opcion de ordenamiento al default
        setFilters(initialFilters)
        sendFilters(initialFilters)
    }


  return (
    <form className="filters-bar" onSubmit={handleSubmit}>
        <div className="filters-head">
            <button
                type="button"
                className={`filters-toggle ${isOpen ? "is-open" : ""}`}
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls="filters-panel"
            >
                <span className="filters-caret" aria-hidden="true">▾</span>
                {t("filters.title")}
                {activeCount > 0 && <span className="filters-badge">{activeCount}</span>}
            </button>

            <div className="filters-sort">
                <label className="filters-sort-label" htmlFor="sortBy">{t("filters.sortBy")}</label>
                <select
                    id="sortBy"
                    className="filters-select"
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    {sortingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {t(option.label)}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="filters-direction"
                    onClick={toggleSortDirection}
                    aria-label={t(filters.ascending ? "filters.ascending" : "filters.descending")}
                    title={t(filters.ascending ? "filters.ascending" : "filters.descending")}
                >
                    {filters.ascending ? "↑" : "↓"}
                </button>
            </div>
        </div>

        {isOpen && (
            <div className="filters-panel" id="filters-panel">
                <div className="filters-grid">
                    <div className="field">
                        <label className="field-label" htmlFor="category">{t("filters.category")}</label>
                        <InputField
                            type="text"
                            id="category"
                            placeholder={t("filters.category")}
                            value={filters.category || ""}
                            onChange={(e) => updateFilter("category", e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="name">{t("filters.name")}</label>
                        <InputField
                            type="text"
                            id="name"
                            placeholder={t("filters.name")}
                            value={filters.name || ""}
                            onChange={(e) => updateFilter("name", e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="brand">{t("filters.brand")}</label>
                        <InputField
                            type="text"
                            id="brand"
                            placeholder={t("filters.brand")}
                            value={filters.brand || ""}
                            onChange={(e) => updateFilter("brand", e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="pattern">{t("filters.pattern")}</label>
                        <select
                            id="pattern"
                            className="filters-select"
                            value={filters.pattern ?? ""}
                            onChange={(e) => updateFilter("pattern", e.target.value === "" ? null : (e.target.value as Pattern))}
                        >
                            <option value="">{t("filters.all")}</option>
                            {Object.values(Pattern).map((pattern) => (
                                <option key={pattern} value={pattern}>
                                    {t(`pattern.${pattern}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="season">{t("filters.season")}</label>
                        <select
                            id="season"
                            className="filters-select"
                            value={filters.season ?? ""}
                            onChange={(e) => updateFilter("season", e.target.value === "" ? null : (e.target.value as Season))}
                        >
                            <option value="">{t("filters.all")}</option>
                            {Object.values(Season).map((season) => (
                                <option key={season} value={season}>
                                    {t(`season.${season}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <span className="field-label">{t("filters.formality")}</span>
                        <div className="filters-formality" role="group" aria-label={t("filters.formality")}>
                            {FORMALITY_LEVELS.map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    className={`filters-dot ${filters.formality === level ? "is-on" : ""}`}
                                    onClick={() => toggleFormality(level)}
                                    aria-pressed={filters.formality === level}
                                    aria-label={t(`formality.${level}`)}
                                    title={t(`formality.${level}`)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="field filters-check">
                        <input
                            type="checkbox"
                            id="onlyArchived"
                            checked={filters.active === false}
                            onChange={(e) => updateFilter("active", e.target.checked ? false : null)}
                        />
                        <label htmlFor="onlyArchived">{t("filters.onlyArchived")}</label>
                    </div>
                </div>

                <div className="filters-actions">
                    <ChipButton type="submit" text={t("filters.apply")} />
                    <ChipButton type="button" variant="ghost" text={t("filters.clear")} onClick={handleClearFilters} />
                </div>
            </div>
        )}
    </form>
  )
}

export default Filters
