
"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormGroup } from "@/components/ui/FormGroup"
import { X, Plus, Tag } from "lucide-react"
import styles from "../PropertyForm.module.css"

interface FeaturesFormProps {
  features: string[]
  onFeaturesChange: (features: string[]) => void
  keywords: string[]
  onKeywordsChange: (keywords: string[]) => void
  formData: any
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function FeaturesForm({
  features,
  onFeaturesChange,
  keywords,
  onKeywordsChange,
  formData,
  onChange,
}: FeaturesFormProps) {
  const [newFeature, setNewFeature] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onFeaturesChange([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features]
    updatedFeatures.splice(index, 1)
    onFeaturesChange(updatedFeatures)
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      onKeywordsChange([...keywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = [...keywords]
    updatedKeywords.splice(index, 1)
    onKeywordsChange(updatedKeywords)
  }

  return (
    <>
      <div className={styles.formSection}>
        <h2>Property Features</h2>
        <p className={styles.helpText}>
          Add key features of the property such as "Gas Central Heating", "Double Glazing", "Private Garden", etc.
        </p>

        <div className={styles.addFeatureForm}>
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
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
      </div>

      <div className={styles.formSection}>
        <h2>SEO &amp; Search</h2>
        <div className={styles.formRow}>
          <FormGroup className={styles.formGroup}>
            <label htmlFor="meta_title">Meta Title</label>
            <Input
              id="meta_title"
              name="meta_title"
              value={formData.meta_title}
              onChange={onChange}
              placeholder="Custom title for search engine results"
            />
          </FormGroup>
        </div>
        <div className={styles.formRow}>
          <FormGroup className={styles.formGroup}>
            <label htmlFor="meta_description">Meta Description</label>
            <Input
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={onChange}
              placeholder="Short description for search engine results"
            />
          </FormGroup>
        </div>
        <div className={styles.formRow}>
          <FormGroup className={styles.formGroup}>
            <label>Keywords</label>
            <div className={styles.addFeatureForm}>
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                placeholder="Add relevant keywords..."
              />
              <Button type="button" onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
                <Tag size={16} /> Add Keyword
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className={styles.featuresList}>
                {keywords.map((keyword, index) => (
                  <div key={index} className={styles.featureItem}>
                    <span className={styles.featureText}>{keyword}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveKeyword(index)}
                      title="Remove keyword"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormGroup>
        </div>
      </div>
    </>
  )
}
