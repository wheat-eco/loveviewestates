"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/Button"
import { Upload, X, Star } from "lucide-react"
import styles from "../PropertyForm.module.css"

interface ImagesFormProps {
  imageFiles: File[]
  previewUrls: string[]
  onChange: (files: File[]) => void
}

export function ImagesForm({ imageFiles, previewUrls, onChange }: ImagesFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onChange([...imageFiles, ...files])
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...imageFiles]
    updatedFiles.splice(index, 1)
    onChange(updatedFiles)
  }

  const handleSetFeatured = (index: number) => {
    // Move the selected image to the first position
    const updatedFiles = [...imageFiles]
    const [featuredFile] = updatedFiles.splice(index, 1)
    updatedFiles.unshift(featuredFile)
    onChange(updatedFiles)
  }

  return (
    <div className={styles.formSection}>
      <h2>Property Images</h2>

      <p className={styles.helpText}>
        Upload high-quality images of the property. The first image will be used as the featured image. Recommended
        size: 1200x800px or larger.
      </p>

      <div className={styles.uploadArea}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} />
          Upload Images
        </Button>
      </div>

      {previewUrls.length > 0 && (
        <div className={styles.imagePreviewContainer}>
          {previewUrls.map((url, index) => (
            <div key={index} className={styles.imagePreview}>
              <img src={url || "/placeholder.svg"} alt={`Property image ${index + 1}`} />

              {index === 0 && (
                <div className={styles.featuredBadge}>
                  <Star size={12} />
                  Featured
                </div>
              )}

              <div className={styles.imagePreviewOverlay}>
                <div className={styles.imageActions}>
                  {index !== 0 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSetFeatured(index)}
                      title="Set as featured image"
                    >
                      <Star size={16} />
                    </Button>
                  )}

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveImage(index)}
                    title="Remove image"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewUrls.length === 0 && (
        <div className={styles.emptyState}>
          <Upload size={48} />
          <p>No images uploaded yet. Add some high-quality photos to showcase your property.</p>
        </div>
      )}
    </div>
  )
}
