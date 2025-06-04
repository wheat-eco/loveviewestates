"use client"

import type React from "react"

import { useState } from "react"
import { createRegion, type Region } from "@/lib/supabase-client"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/spinner"
import styles from "./RegionModal.module.css"

interface CreateRegionModalProps {
  isOpen: boolean
  onClose: () => void
  onRegionCreated: (region: Region) => void
}

export function CreateRegionModal({ isOpen, onClose, onRegionCreated }: CreateRegionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const region = await createRegion(formData.name, formData.description)
      onRegionCreated(region)
      setFormData({ name: "", description: "" })
      onClose()
    } catch (err) {
      console.error("Error creating region:", err)
      setError(err instanceof Error ? err.message : "Failed to create region")
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Region">
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
                Creating...
              </>
            ) : (
              "Create Region"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
