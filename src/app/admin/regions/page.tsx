
"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { type Region, type Area, fetchRegions, fetchAllAreas, deleteRegion as deleteRegionAction, deleteArea as deleteAreaAction } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { CreateRegionModal } from "@/components/admin/regions/CreateRegionModal"
import { CreateAreaModal } from "@/components/admin/regions/CreateAreaModal"
import { Edit, Trash2, Eye } from "lucide-react"
import styles from "./regions.module.css"

export default function RegionsPage() {
  const supabase = createClientComponentClient()

  const [regions, setRegions] = useState<Region[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState({ regions: true, areas: true })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Modal state
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false)
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [editingArea, setEditingArea] = useState<Area | null>(null)

  useEffect(() => {
    loadRegions()
    loadAreas()
  }, [])

  const loadRegions = async () => {
    setLoading(prev => ({ ...prev, regions: true }))
    try {
      const regionsData = await fetchRegions()
      setRegions(regionsData)
    } catch (err) {
      handleError("Failed to load regions")
    } finally {
      setLoading(prev => ({ ...prev, regions: false }))
    }
  }

  const loadAreas = async () => {
    setLoading(prev => ({ ...prev, areas: true }))
    try {
      const areasData = await fetchAllAreas()
      setAreas(areasData)
    } catch (err) {
      handleError("Failed to load areas")
    } finally {
      setLoading(prev => ({ ...prev, areas: false }))
    }
  }

  const handleError = (message: string, err?: any) => {
    console.error(message, err)
    setError(message)
    setSuccess(null)
  }
  
  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError(null)
    setTimeout(() => setSuccess(null), 3000)
  }

  const openRegionModal = (region: Region | null = null) => {
    setEditingRegion(region)
    setIsRegionModalOpen(true)
  }

  const openAreaModal = (area: Area | null = null) => {
    setEditingArea(area)
    setIsAreaModalOpen(true)
  }

  const handleRegionSaved = (region: Region) => {
    if (editingRegion) {
      setRegions(regions.map(r => r.id === region.id ? region : r))
      handleSuccess("Region updated successfully")
    } else {
      setRegions([...regions, region])
      handleSuccess("Region created successfully")
    }
    loadAreas(); // Reload areas in case region name changed
    setIsRegionModalOpen(false)
    setEditingRegion(null)
  }

  const handleAreaSaved = (area: Area) => {
    if (editingArea) {
      setAreas(areas.map(a => a.id === area.id ? area : a))
      handleSuccess("Area updated successfully")
    } else {
      setAreas([...areas, area])
      handleSuccess("Area created successfully")
    }
    setIsAreaModalOpen(false)
    setEditingArea(null)
  }

  const handleDeleteRegion = async (regionId: number) => {
    if (!confirm("Are you sure you want to delete this region? This will also delete all areas within it. This action cannot be undone.")) {
      return
    }
    try {
      await deleteRegionAction(regionId)
      setRegions(regions.filter(r => r.id !== regionId))
      setAreas(areas.filter(a => a.region_id !== regionId))
      handleSuccess("Region deleted successfully")
    } catch (err) {
      handleError((err as Error).message)
    }
  }

  const handleDeleteArea = async (areaId: number) => {
    if (!confirm("Are you sure you want to delete this area? This action cannot be undone.")) {
      return
    }
    try {
      await deleteAreaAction(areaId)
      setAreas(areas.filter(a => a.id !== areaId))
      handleSuccess("Area deleted successfully")
    } catch (err) {
      handleError((err as Error).message)
    }
  }

  return (
    <AdminLayout title="Manage Regions & Areas">
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <div className={styles.gridContainer}>
        {/* Regions Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Regions</h2>
            <Button onClick={() => openRegionModal()}>Add Region</Button>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Region Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading.regions ? (
                  <tr><td colSpan={3} className={styles.loadingCell}><Spinner /></td></tr>
                ) : regions.length > 0 ? (
                  regions.map((region) => (
                    <tr key={region.id}>
                      <td>{region.name}</td>
                      <td>{region.slug}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Button variant="outline" size="icon" onClick={() => openRegionModal(region)} title="Edit Region"><Edit size={16} /></Button>
                          <Button variant="danger" size="icon" onClick={() => handleDeleteRegion(region.id)} title="Delete Region"><Trash2 size={16} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className={styles.emptyMessage}>No regions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Areas Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Areas</h2>
            <Button onClick={() => openAreaModal()}>Add Area</Button>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Area Name</th>
                  <th>Region</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading.areas ? (
                  <tr><td colSpan={3} className={styles.loadingCell}><Spinner /></td></tr>
                ) : areas.length > 0 ? (
                  areas.map((area) => (
                    <tr key={area.id}>
                      <td>{area.name}</td>
                      <td>{area.regions?.name || 'N/A'}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Button variant="outline" size="icon" onClick={() => openAreaModal(area)} title="Edit Area"><Edit size={16} /></Button>
                          <Button variant="danger" size="icon" onClick={() => handleDeleteArea(area.id)} title="Delete Area"><Trash2 size={16} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className={styles.emptyMessage}>No areas found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isRegionModalOpen && (
        <CreateRegionModal
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          onRegionSaved={handleRegionSaved}
          existingRegion={editingRegion}
        />
      )}

      {isAreaModalOpen && (
        <CreateAreaModal
          isOpen={isAreaModalOpen}
          onClose={() => setIsAreaModalOpen(false)}
          regions={regions}
          onAreaSaved={handleAreaSaved}
          existingArea={editingArea}
        />
      )}
    </AdminLayout>
  )
}

    