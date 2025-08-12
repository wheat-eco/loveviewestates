
"use client"

import type React from "react"
import { useState, useRef, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { PropertyImage } from "@/lib/supabase-client"

import { Button } from "@/components/ui/button"
import { Upload, X, Star, GripVertical } from "lucide-react"
import styles from "../PropertyForm.module.css"

interface ImagesFormProps {
  images: (File | PropertyImage)[]
  onImagesChange: (images: (File | PropertyImage)[]) => void
}

interface SortableImageProps {
  image: File | PropertyImage
  onRemove: () => void
  onSetFeatured: () => void
  isFeatured: boolean
}

function SortableImage({ image, onRemove, onSetFeatured, isFeatured }: SortableImageProps) {
  const id = image instanceof File ? image.name : image.id.toString()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  const imageUrl = useMemo(() => {
    return image instanceof File ? URL.createObjectURL(image) : image.image_url
  }, [image])
  
  const altText = image instanceof File ? image.name : image.alt_text || 'Property Image'

  return (
    <div ref={setNodeRef} style={style} className={`${styles.imagePreview} ${isDragging ? styles.dragging : ''}`}>
      <img src={imageUrl} alt={altText} />
      <div className={styles.imagePreviewOverlay}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          title="Remove image"
          className="text-white hover:text-red-500"
        >
          <X size={16} />
        </Button>
      </div>
      <div className={styles.imageActions}>
          <button type="button" onClick={onSetFeatured} title="Set as featured" className={styles.featuredButton}>
              <Star size={16} className={isFeatured ? styles.isFeatured : ''} />
          </button>
          <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder">
              <GripVertical size={16} />
          </div>
      </div>
      {isFeatured && <div className={styles.featuredBadge}><Star size={12} /> Featured</div>}
    </div>
  )
}

export function ImagesForm({ images, onImagesChange }: ImagesFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onImagesChange([...images, ...files])
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    if (imageToRemove instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(imageToRemove));
    }
    onImagesChange(images.filter((_, index) => index !== indexToRemove))
  }
  
  const handleSetFeatured = (indexToFeature: number) => {
      const updatedImages = images.map((img, index) => {
          const isFeatured = index === indexToFeature;
          if (img instanceof File) {
              // This is a temporary state for new files, backend will handle final object
              return Object.assign(img, { is_featured: isFeatured });
          }
          return { ...img, is_featured: isFeatured };
      });
      onImagesChange(updatedImages);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => (img instanceof File ? img.name : img.id.toString()) === active.id)
      const newIndex = images.findIndex((img) => (img instanceof File ? img.name : img.id.toString()) === over.id)
      onImagesChange(arrayMove(images, oldIndex, newIndex))
    }
  }

  const imageIds = useMemo(() => images.map(img => img instanceof File ? img.name : img.id.toString()), [images]);
  const featuredIndex = useMemo(() => images.findIndex(img => 'is_featured' in img && img.is_featured), [images]);


  return (
    <div className={styles.formSection}>
      <h2>Property Images</h2>
      <p className={styles.helpText}>
        Upload high-quality images. Drag to reorder. The first image is the default featured image unless another is selected with the star icon.
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
          <Upload size={16} /> Upload Images
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imageIds} strategy={rectSortingStrategy}>
          <div className={styles.imagePreviewContainer}>
            {images.map((image, index) => (
              <SortableImage
                key={image instanceof File ? image.name : image.id}
                image={image}
                onRemove={() => handleRemoveImage(index)}
                onSetFeatured={() => handleSetFeatured(index)}
                isFeatured={featuredIndex === index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
