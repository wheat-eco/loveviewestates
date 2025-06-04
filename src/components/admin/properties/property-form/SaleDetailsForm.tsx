"use client"

import type React from "react"

import { FormGroup } from "@/components/ui/FormGroup"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import styles from "../PropertyForm.module.css"

interface SaleDetailsFormProps {
  formData: any
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export function SaleDetailsForm({ formData, onChange }: SaleDetailsFormProps) {
  return (
    <div className={styles.formSection}>
      <h2>Sale Property Details</h2>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="tenure">
            Tenure <span className={styles.required}>*</span>
          </label>
          <Select id="tenure" name="tenure" value={formData.tenure} onChange={onChange} required>
            <option value="">Select Tenure</option>
            <option value="Freehold">Freehold</option>
            <option value="Leasehold">Leasehold</option>
            <option value="Share of Freehold">Share of Freehold</option>
            <option value="Shared Ownership">Shared Ownership</option>
          </Select>
        </FormGroup>

        {formData.tenure === "Leasehold" && (
          <FormGroup>
            <label htmlFor="lease_remaining">Lease Remaining (years)</label>
            <Input
              type="number"
              id="lease_remaining"
              name="lease_remaining"
              value={formData.lease_remaining}
              onChange={onChange}
              min="0"
              placeholder="e.g. 125"
            />
          </FormGroup>
        )}
      </div>

      {(formData.tenure === "Leasehold" || formData.tenure === "Share of Freehold") && (
        <div className={styles.formRow}>
          <FormGroup>
            <label htmlFor="service_charge">Service Charge (£ per year)</label>
            <Input
              type="number"
              id="service_charge"
              name="service_charge"
              value={formData.service_charge}
              onChange={onChange}
              min="0"
              step="0.01"
              placeholder="e.g. 1200"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="ground_rent">Ground Rent (£ per year)</label>
            <Input
              type="number"
              id="ground_rent"
              name="ground_rent"
              value={formData.ground_rent}
              onChange={onChange}
              min="0"
              step="0.01"
              placeholder="e.g. 250"
            />
          </FormGroup>
        </div>
      )}

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="epc_rating">EPC Rating</label>
          <Select id="epc_rating" name="epc_rating" value={formData.epc_rating} onChange={onChange}>
            <option value="">Select Rating</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="Exempt">Exempt</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label htmlFor="council_tax_band">Council Tax Band</label>
          <Select id="council_tax_band" name="council_tax_band" value={formData.council_tax_band} onChange={onChange}>
            <option value="">Select Band</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
          </Select>
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="year_built">Year Built</label>
          <Input
            type="number"
            id="year_built"
            name="year_built"
            value={formData.year_built}
            onChange={onChange}
            min="1500"
            max={new Date().getFullYear()}
            placeholder="e.g. 1995"
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="construction_type">Construction Type</label>
          <Select
            id="construction_type"
            name="construction_type"
            value={formData.construction_type}
            onChange={onChange}
          >
            <option value="">Select Type</option>
            <option value="Brick">Brick</option>
            <option value="Stone">Stone</option>
            <option value="Timber Frame">Timber Frame</option>
            <option value="Concrete">Concrete</option>
            <option value="Steel Frame">Steel Frame</option>
            <option value="Other">Other</option>
          </Select>
        </FormGroup>
      </div>
    </div>
  )
}
