"use client"

import type React from "react"

import { FormGroup } from "@/components/ui/FormGroup"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import styles from "../PropertyForm.module.css"

interface RentalDetailsFormProps {
  formData: any
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export function RentalDetailsForm({ formData, onChange }: RentalDetailsFormProps) {
  return (
    <div className={styles.formSection}>
      <h2>Rental Property Details</h2>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="furnished_status">
            Furnished Status <span className={styles.required}>*</span>
          </label>
          <Select
            id="furnished_status"
            name="furnished_status"
            value={formData.furnished_status}
            onChange={onChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Furnished">Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Part Furnished">Part Furnished</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label htmlFor="deposit_amount">Deposit Amount</label>
          <Input
            type="number"
            id="deposit_amount"
            name="deposit_amount"
            value={formData.deposit_amount}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="e.g. 1000"
          />
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="minimum_tenancy">Minimum Tenancy (months)</label>
          <Input
            type="number"
            id="minimum_tenancy"
            name="minimum_tenancy"
            value={formData.minimum_tenancy}
            onChange={onChange}
            min="0"
            placeholder="e.g. 6"
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="maximum_tenancy">Maximum Tenancy (months)</label>
          <Input
            type="number"
            id="maximum_tenancy"
            name="maximum_tenancy"
            value={formData.maximum_tenancy}
            onChange={onChange}
            min="0"
            placeholder="e.g. 12"
          />
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup>
          <label htmlFor="pets_policy">Pets Policy</label>
          <Select id="pets_policy" name="pets_policy" value={formData.pets_policy} onChange={onChange}>
            <option value="">Select Policy</option>
            <option value="Allowed">Allowed</option>
            <option value="Not Allowed">Not Allowed</option>
            <option value="Considered">Considered</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label htmlFor="smoking_policy">Smoking Policy</label>
          <Select id="smoking_policy" name="smoking_policy" value={formData.smoking_policy} onChange={onChange}>
            <option value="">Select Policy</option>
            <option value="Allowed">Allowed</option>
            <option value="Not Allowed">Not Allowed</option>
            <option value="Outside Only">Outside Only</option>
          </Select>
        </FormGroup>
      </div>

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
    </div>
  )
}
