
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createRegion, updateRegion, type Region } from "@/lib/supabase-client"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import styles from "./RegionModal.module.css"

interface CreateRegionModalProps {
  isOpen: boolean
  onClose: () => void
  onRegionSaved: (region: Region) => void
  existingRegion?: Region | null
}

export function CreateRegionModal({ isOpen, onClose, onRegionSaved, existingRegion }: CreateRegionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existingRegion) {
      setFormData({
        name: existingRegion.name || "",
        description: existingRegion.description || "",
      })
    } else {
      setFormData({ name: "", description: "" })
    }
  }, [existingRegion, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("Region name is required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      let savedRegion: Region;
      if (existingRegion) {
        savedRegion = await updateRegion(existingRegion.id, formData.name, formData.description)
      } else {
        savedRegion = await createRegion(formData.name, formData.description)
      }
      onRegionSaved(savedRegion)
      handleClose()
    } catch (err) {
      console.error("Error saving region:", err)
      setError(err instanceof Error ? err.message : "Failed to save region")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", description: "" })
      setError(null)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={existingRegion ? "Edit Region" : "Create New Region"}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <Alert variant="error">{error}</Alert>}

        <div className={styles.formGroup}>
          <label htmlFor="region-name">Region Name *</label>
          <Input
            id="region-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. East Ayrshire"
            disabled={loading}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="region-description">Description</label>
          <Textarea
            id="region-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description of the region..."
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
                Saving...
              </>
            ) : (
              "Save Region"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
