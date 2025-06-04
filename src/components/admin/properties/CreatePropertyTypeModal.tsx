"use client"

import type React from "react"

import { useState } from "react"
import { createPropertyType, type PropertyCategory, type PropertyType } from "@/lib/supabase-client"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormGroup } from "@/components/ui/FormGroup"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import styles from "../regions/RegionModal.module.css"

interface CreatePropertyTypeModalProps {
  isOpen: boolean
  onClose: () => void
  categories: PropertyCategory[]
  selectedCategoryId?: number
  onPropertyTypeCreated: (propertyType: PropertyType) => void
}

export function CreatePropertyTypeModal({
  isOpen,
  onClose,
  categories,
  selectedCategoryId,
  onPropertyTypeCreated,
}: CreatePropertyTypeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    categoryId: selectedCategoryId?.toString() || "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.displayName.trim() || !formData.categoryId) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const propertyType = await createPropertyType(
        formData.name,
        formData.displayName,
        Number(formData.categoryId),
        formData.description,
      )

      onPropertyTypeCreated(propertyType)
      setFormData({ name: "", displayName: "", categoryId: selectedCategoryId?.toString() || "", description: "" })
      onClose()
    } catch (err) {
      console.error("Error creating property type:", err)
      setError(err instanceof Error ? err.message : "Failed to create property type")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Property Type">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {error && <Alert variant="error">{error}</Alert>}

        <FormGroup label="Category" required>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className={styles.modalSelect}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.display_name}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label="Display Name" required>
          <Input
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="e.g., Detached House"
            required
          />
        </FormGroup>

        <FormGroup label="Internal Name" required>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., detached_house"
            required
          />
          <small className={styles.fieldHint}>Used internally - lowercase with underscores</small>
        </FormGroup>

        <FormGroup label="Description">
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description of this property type"
            rows={3}
          />
        </FormGroup>

        <div className={styles.modalActions}>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="small" />
                Creating...
              </>
            ) : (
              "Create Property Type"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
