"use client"

import type React from "react"

import { FormGroup } from "@/components/ui/FormGroup"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Region, Area } from "@/lib/supabase-client"
import { PlusCircle } from "lucide-react"
import styles from "../PropertyForm.module.css"

interface LocationFormProps {
  formData: any
  regions: Region[]
  areas: Area[]
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onCreateRegion: () => void
  onCreateArea: () => void
}

export function LocationForm({ formData, regions, areas, onChange, onCreateRegion, onCreateArea }: LocationFormProps) {
  return (
    <div className={styles.formSection}>
      <h2>Property Location</h2>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="region_id">
            Region <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithButton}>
            <Select id="region_id" name="region_id" value={formData.region_id} onChange={onChange} required>
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Select>
            <Button type="button" variant="outline" size="icon" onClick={onCreateRegion} title="Add New Region">
              <PlusCircle size={18} />
            </Button>
          </div>
        </FormGroup>

        <FormGroup>
          <label htmlFor="area_id">
            Area <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithButton}>
            <Select
              id="area_id"
              name="area_id"
              value={formData.area_id}
              onChange={onChange}
              required
              disabled={!formData.region_id}
            >
              <option value="">{formData.region_id ? "Select Area" : "Select Region First"}</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onCreateArea}
              disabled={!formData.region_id}
              title="Add New Area"
            >
              <PlusCircle size={18} />
            </Button>
          </div>
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="address">
            Address <span className={styles.required}>*</span>
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="e.g. 123 Main Street"
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="postcode">
            Postcode <span className={styles.required}>*</span>
          </label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={onChange}
            placeholder="e.g. KA1 1AA"
            required
          />
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="latitude">Latitude</label>
          <Input
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={onChange}
            placeholder="e.g. 55.6112"
          />
          <p className={styles.helpText}>Optional: For map display</p>
        </FormGroup>

        <FormGroup>
          <label htmlFor="longitude">Longitude</label>
          <Input
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={onChange}
            placeholder="e.g. -4.4998"
          />
          <p className={styles.helpText}>Optional: For map display</p>
        </FormGroup>
      </div>
    </div>
  )
}
