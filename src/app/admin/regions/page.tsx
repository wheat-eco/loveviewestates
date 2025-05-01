"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import styles from "./regions.module.css"

export default function RegionsPage() {
  const supabase = createClientComponentClient()

  const [regions, setRegions] = useState<{ id: number; name: string }[]>([])
  const [areas, setAreas] = useState<{ id: number; name: string; regions?: { id: number; name: string } }[]>([])
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Form data
  const [newRegionName, setNewRegionName] = useState("")
  const [editRegionId, setEditRegionId] = useState<number | null>(null)
  const [editRegionName, setEditRegionName] = useState("")
  const [newAreaName, setNewAreaName] = useState("")
  const [newAreaRegionId, setNewAreaRegionId] = useState("")
  const [editAreaId, setEditAreaId] = useState<number | null>(null)
  const [editAreaName, setEditAreaName] = useState("")
  const [editAreaRegionId, setEditAreaRegionId] = useState("")

  // Fetch regions on component mount
  useEffect(() => {
    fetchRegions()
  }, [])

  // Fetch areas when selected region changes
  useEffect(() => {
    if (selectedRegionId) {
      fetchAreas(selectedRegionId)
    } else {
      fetchAllAreas()
    }
  }, [selectedRegionId])

  async function fetchRegions() {
    const { data, error } = await supabase.from("regions").select("*").order("name")

    if (error) {
      console.error("Error fetching regions:", error)
    } else {
      setRegions(data)
    }
  }

  async function fetchAreas(regionId: number) {
    const { data, error } = await supabase
      .from("areas")
      .select(`
        *,
        regions (
          id,
          name
        )
      `)
      .eq("region_id", regionId)
      .order("name")

    if (error) {
      console.error("Error fetching areas:", error)
    } else {
      setAreas(data)
    }
  }

  async function fetchAllAreas() {
    const { data, error } = await supabase
      .from("areas")
      .select(`
        *,
        regions (
          id,
          name
        )
      `)
      .order("regions.name")
      .order("name")

    if (error) {
      console.error("Error fetching all areas:", error)
    } else {
      setAreas(data)
    }
  }

  // Add new region
  async function handleAddRegion(e: { preventDefault: () => void }) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    if (!newRegionName.trim()) {
      setError("Region name cannot be empty")
      setIsSubmitting(false)
      return
    }

    // Generate slug
    const slug = newRegionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const { data, error } = await supabase.from("regions").insert({
      name: newRegionName.trim(),
      slug,
    })

    if (error) {
      setError(`Error adding region: ${error.message}`)
    } else {
      setSuccess("Region added successfully")
      setNewRegionName("")
      fetchRegions()
    }

    setIsSubmitting(false)
  }

  // Edit region
  function startEditRegion(region: { id: number; name: string }) {
    setEditRegionId(region.id)
    setEditRegionName(region.name)
  }

  async function handleUpdateRegion(e: { preventDefault: () => void }) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    if (!editRegionName.trim()) {
      setError("Region name cannot be empty")
      setIsSubmitting(false)
      return
    }

    // Generate slug
    const slug = editRegionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const { error } = await supabase
      .from("regions")
      .update({
        name: editRegionName.trim(),
        slug,
      })
      .eq("id", editRegionId)

    if (error) {
      setError(`Error updating region: ${error.message}`)
    } else {
      setSuccess("Region updated successfully")
      setEditRegionId(null)
      setEditRegionName("")
      fetchRegions()
    }

    setIsSubmitting(false)
  }

  // Delete region
  async function handleDeleteRegion(regionId: number | null) {
    if (!confirm("Are you sure you want to delete this region? This will also delete all areas in this region.")) {
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    // Check if region has properties
    const { data: properties } = await supabase.from("properties").select("id").eq("areas.region_id", regionId).limit(1)

    if (properties && properties.length > 0) {
      setError("Cannot delete region with existing properties. Update or delete properties first.")
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from("regions").delete().eq("id", regionId)

    if (error) {
      setError(`Error deleting region: ${error.message}`)
    } else {
      setSuccess("Region deleted successfully")
      if (selectedRegionId === regionId) {
        setSelectedRegionId(null)
      }
      fetchRegions()
    }

    setIsSubmitting(false)
  }

  // Add new area
  async function handleAddArea(e: { preventDefault: () => void }) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    if (!newAreaName.trim() || !newAreaRegionId) {
      setError("Area name and region are required")
      setIsSubmitting(false)
      return
    }

    // Generate slug
    const slug = newAreaName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const { data, error } = await supabase.from("areas").insert({
      name: newAreaName.trim(),
      slug,
      region_id: newAreaRegionId,
    })

    if (error) {
      setError(`Error adding area: ${error.message}`)
    } else {
      setSuccess("Area added successfully")
      setNewAreaName("")
      setNewAreaRegionId("")
      if (selectedRegionId) {
        fetchAreas(selectedRegionId)
      } else {
        fetchAllAreas()
      }
    }

    setIsSubmitting(false)
  }

  // Edit area
  function startEditArea(area: { id: number; name: string; region_id: string }) {
      setEditAreaId(area.id)
      setEditAreaName(area.name)
      setEditAreaRegionId(area.region_id)
  }

  async function handleUpdateArea(e: { preventDefault: () => void }) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    if (!editAreaName.trim() || !editAreaRegionId) {
      setError("Area name and region are required")
      setIsSubmitting(false)
      return
    }

    // Generate slug
    const slug = editAreaName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const { error } = await supabase
      .from("areas")
      .update({
        name: editAreaName.trim(),
        slug,
        region_id: editAreaRegionId,
      })
      .eq("id", editAreaId)

    if (error) {
      setError(`Error updating area: ${error.message}`)
    } else {
      setSuccess("Area updated successfully")
      setEditAreaId(null)
      setEditAreaName("")
      setEditAreaRegionId("")
      if (selectedRegionId) {
        fetchAreas(selectedRegionId)
      } else {
        fetchAllAreas()
      }
    }

    setIsSubmitting(false)
  }

  // Delete area
  async function handleDeleteArea(areaId: any) {
    if (!confirm("Are you sure you want to delete this area?")) {
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    // Check if area has properties
    const { data: properties } = await supabase.from("properties").select("id").eq("area_id", areaId).limit(1)

    if (properties && properties.length > 0) {
      setError("Cannot delete area with existing properties. Update or delete properties first.")
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from("areas").delete().eq("id", areaId)

    if (error) {
      setError(`Error deleting area: ${error.message}`)
    } else {
      setSuccess("Area deleted successfully")
      if (selectedRegionId) {
        fetchAreas(selectedRegionId)
      } else {
        fetchAllAreas()
      }
    }

    setIsSubmitting(false)
  }

  return (
    <AdminLayout title="Manage Regions & Areas">
      {success && <div className={styles.alertSuccess}>{success}</div>}
      {error && <div className={styles.alertDanger}>{error}</div>}

      <div className={styles.gridContainer}>
        <div className={styles.regionsSection}>
          <div className={styles.card}>
            <h2>Regions</h2>

            <form onSubmit={handleAddRegion} className={styles.addForm}>
              <div className={styles.formGroup}>
                <label htmlFor="new_region_name">Add New Region</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="new_region_name"
                    value={newRegionName}
                    onChange={(e) => setNewRegionName(e.target.value)}
                    placeholder="Region Name"
                    required
                  />
                  <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                    Add
                  </button>
                </div>
              </div>
            </form>

            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Region Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((region) => (
                    <tr key={region.id}>
                      <td>
                        {editRegionId === region.id ? (
                          <form onSubmit={handleUpdateRegion} className={styles.inlineForm}>
                            <input
                              type="text"
                              value={editRegionName}
                              onChange={(e) => setEditRegionName(e.target.value)}
                              required
                            />
                            <button type="submit" className={styles.btnSmall} disabled={isSubmitting}>
                              Save
                            </button>
                            <button
                              type="button"
                              className={styles.btnSmallSecondary}
                              onClick={() => setEditRegionId(null)}
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          region.name
                        )}
                      </td>
                      <td>
                        {editRegionId !== region.id && (
                          <div className={styles.actionButtons}>
                            <button onClick={() => startEditRegion(region)} className={styles.btnSmall}>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRegion(region.id)}
                              className={styles.btnSmallDanger}
                              disabled={isSubmitting}
                            >
                              Delete
                            </button>
                            <button onClick={() => setSelectedRegionId(region.id)} className={styles.btnSmallSecondary}>
                              View Areas
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {regions.length === 0 && (
                    <tr>
                      <td colSpan={2} className={styles.emptyMessage}>
                        No regions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.areasSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Areas {selectedRegionId && `for ${regions.find((r) => r.id === selectedRegionId)?.name}`}</h2>
              {selectedRegionId && (
                <button onClick={() => setSelectedRegionId(null)} className={styles.btnSecondary}>
                  Show All Areas
                </button>
              )}
            </div>

            <form onSubmit={handleAddArea} className={styles.addForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="new_area_name">Area Name</label>
                  <input
                    type="text"
                    id="new_area_name"
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    placeholder="Area Name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="new_area_region_id">Region</label>
                  <select
                    id="new_area_region_id"
                    value={newAreaRegionId}
                    onChange={(e) => setNewAreaRegionId(e.target.value)}
                    required
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>&nbsp;</label>
                  <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                    Add Area
                  </button>
                </div>
              </div>
            </form>

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
                  {areas.map((area) => (
                    <tr key={area.id}>
                      <td>
                        {editAreaId === area.id ? (
                          <input
                            type="text"
                            value={editAreaName}
                            onChange={(e) => setEditAreaName(e.target.value)}
                            required
                          />
                        ) : (
                          area.name
                        )}
                      </td>
                      <td>
                        {editAreaId === area.id ? (
                          <select
                            value={editAreaRegionId}
                            onChange={(e) => setEditAreaRegionId(e.target.value)}
                            required
                          >
                            {regions.map((region) => (
                              <option key={region.id} value={region.id}>
                                {region.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          area.regions?.name
                        )}
                      </td>
                      <td>
                        {editAreaId === area.id ? (
                          <div className={styles.actionButtons}>
                            <button onClick={handleUpdateArea} className={styles.btnSmall} disabled={isSubmitting}>
                              Save
                            </button>
                            <button onClick={() => setEditAreaId(null)} className={styles.btnSmallSecondary}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className={styles.actionButtons}>
                            <button onClick={() => startEditArea({ ...area, region_id: String(area.regions?.id || "") })} className={styles.btnSmall}>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteArea(area.id)}
                              className={styles.btnSmallDanger}
                              disabled={isSubmitting}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {areas.length === 0 && (
                    <tr>
                      <td colSpan={3} className={styles.emptyMessage}>
                        No areas found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
