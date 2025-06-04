"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { X, Plus } from "lucide-react"
import styles from "../PropertyForm.module.css"

interface FeaturesFormProps {
  features: string[]
  onChange: (features: string[]) => void
}

export function FeaturesForm({ features, onChange }: FeaturesFormProps) {
  const [newFeature, setNewFeature] = useState("")

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onChange([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features]
    updatedFeatures.splice(index, 1)
    onChange(updatedFeatures)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddFeature()
    }
  }

  return (
    <div className={styles.formSection}>
      <h2>Property Features</h2>

      <p className={styles.helpText}>
        Add key features of the property such as "Gas Central Heating", "Double Glazing", "Private Garden", etc.
      </p>

      <div className={styles.addFeatureForm}>
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a property feature..."
          className={styles.addFeatureInput}
        />
        <Button type="button" onClick={handleAddFeature} disabled={!newFeature.trim()}>
          <Plus size={16} />
          Add Feature
        </Button>
      </div>

      {features.length > 0 && (
        <div className={styles.featuresList}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <span className={styles.featureText}>{feature}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFeature(index)}
                title="Remove feature"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {features.length === 0 && (
        <div className={styles.emptyState}>
          <p>No features added yet. Add some key features to make your property listing more attractive.</p>
        </div>
      )}
    </div>
  )
}
