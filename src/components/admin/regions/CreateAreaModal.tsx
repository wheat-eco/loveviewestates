"use client"

import type React from "react"

import { useState } from "react"
import { createArea, type Area, type Region } from "@/lib/supabase-client"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/spinner"
import styles from "./RegionModal.module.css"

interface CreateAreaModalProps {
  isOpen: boolean
  onClose: () => void
  regions: Region[]
  selectedRegionId?: number
  onAreaCreated: (area: Area) => void
}

export function CreateAreaModal({ isOpen, onClose, regions, selectedRegionId, onAreaCreated }: CreateAreaModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    region_id: selectedRegionId?.toString() || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("Area name is required")
      return
    }

    if (!formData.region_id) {
      setError("Please select a region")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const area = await createArea(formData.name, Number.parseInt(formData.region_id), formData.description)
      onAreaCreated(area)
      setFormData({ name: "", description: "", region_id: selectedRegionId?.toString() || "" })
      onClose()
    } catch (err) {
      console.error("Error creating area:", err)
      setError(err instanceof Error ? err.message : "Failed to create area")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", description: "", region_id: selectedRegionId?.toString() || "" })
      setError(null)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Area">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <Alert variant="error">{error}</Alert>}

        <div className={styles.formGroup}>
          <label htmlFor="area-region">Region *</label>
          <Select
            id="area-region"
            name="region_id"
            value={formData.region_id}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="area-name">Area Name *</label>
          <Input
            id="area-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Kilmarnock"
            disabled={loading}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="area-description">Description</label>
          <Textarea
            id="area-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description of the area..."
            rows={3}
            disabled={loading}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="small" />
                Creating...
              </>
            ) : (
              "Create Area"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
