
"use client"

import type React from "react"
import { useState, useRef } from 'react'

import { Button } from "@/components/ui/button"
import { Upload, X, Star } from "lucide-react"
import styles from "../PropertyForm.module.css"

interface ImagesFormProps {
  imageFiles: File[]
  previewUrls: string[]
  onChange: (files: File[]) => void
}

export function ImagesForm({ imageFiles, previewUrls, onChange }: ImagesFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const newFiles = [...imageFiles, ...files];
      onChange(newFiles)
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...newPreviews]);
    }
  }

  const handleRemoveNewImage = (index: number) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
    
    const updatedPreviews = [...newImagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up memory
    updatedPreviews.splice(index, 1);
    setNewImagePreviews(updatedPreviews);
  }
  
  // Note: For simplicity, editing existing images (from previewUrls) is not handled here.
  // A more complex implementation would be needed to manage removals/reordering of existing images.

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
      
      <div className={styles.imagePreviewContainer}>
          {previewUrls.map((url, index) => (
            <div key={`existing-${index}`} className={styles.imagePreview}>
              <img src={url} alt={`Existing property image ${index + 1}`} />
              <div className={styles.imagePreviewOverlay}>
                <p className='text-white text-xs'>Existing Image</p>
              </div>
            </div>
          ))}
          {newImagePreviews.map((url, index) => (
            <div key={`new-${index}`} className={styles.imagePreview}>
              <img src={url} alt={`New property image ${index + 1}`} />
              <div className={styles.imagePreviewOverlay}>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveNewImage(index)}
                  title="Remove image"
                  className="text-white hover:text-red-500"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

    </div>
  )
}
