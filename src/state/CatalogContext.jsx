import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { catalogService } from '../services/catalogService'

const CatalogContext = createContext(null)
const emptyCatalog = { products: [], categories: [], banners: [] }

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(emptyCatalog)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (refresh = false) => {
    setLoading(true)
    setError(null)
    try {
      const nextCatalog = refresh
        ? await catalogService.refresh()
        : await catalogService.getCatalog()
      setCatalog(nextCatalog)
    } catch (loadError) {
      setError(loadError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const value = useMemo(
    () => ({ ...catalog, loading, error, refresh: () => load(true) }),
    [catalog, error, load, loading],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalogData() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalogData must be used inside CatalogProvider')
  return context
}
