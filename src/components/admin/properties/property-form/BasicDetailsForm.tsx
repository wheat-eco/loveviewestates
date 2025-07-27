
"use client"

import type React from "react"

import { FormGroup } from "@/components/ui/FormGroup"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { PropertyCategory, PropertyType } from "@/lib/supabase-client"
import styles from "../PropertyForm.module.css"

interface BasicDetailsFormProps {
  formData: any
  categories: PropertyCategory[]
  propertyTypes: PropertyType[]
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCreatePropertyType: () => void
}

export function BasicDetailsForm({
  formData,
  categories,
  propertyTypes,
  onChange,
  onCheckboxChange,
  onCreatePropertyType,
}: BasicDetailsFormProps) {
  return (
    <div className={styles.formSection}>
      <h2>Basic Property Details</h2>

      <div className={styles.formRow}>
        <FormGroup className={styles.formGroup}>
          <label htmlFor="title">
            Property Title <span className={styles.required}>*</span>
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="e.g. Beautiful 2 Bedroom Apartment in Kilmarnock"
            required
          />
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup className={styles.formGroup}>
          <label htmlFor="category_id">
            Property Category <span className={styles.required}>*</span>
          </label>
          <Select id="category_id" name="category_id" value={formData.category_id} onChange={onChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.display_name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup className={styles.formGroup}>
          <label htmlFor="property_type_id">
            Property Type <span className={styles.required}>*</span>
          </label>
          <div className="flex gap-2">
            <Select
              id="property_type_id"
              name="property_type_id"
              value={formData.property_type_id}
              onChange={onChange}
              required
              disabled={!formData.category_id}
            >
              <option value="">{formData.category_id ? "Select Property Type" : "Select Category First"}</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.display_name}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={onCreatePropertyType}
              disabled={!formData.category_id}
            >
              New
            </Button>
          </div>
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup className={styles.formGroup}>
          <label htmlFor="bedrooms">
            Bedrooms <span className={styles.required}>*</span>
          </label>
          <Input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={onChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup className={styles.formGroup}>
          <label htmlFor="bathrooms">
            Bathrooms <span className={styles.required}>*</span>
          </label>
          <Input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={onChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup className={styles.formGroup}>
          <label htmlFor="reception_rooms">Reception Rooms</label>
          <Input
            type="number"
            id="reception_rooms"
            name="reception_rooms"
            value={formData.reception_rooms}
            onChange={onChange}
            min="0"
          />
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup className={styles.formGroup}>
          <label htmlFor="price">
            Price <span className={styles.required}>*</span>
          </label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={onChange}
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup className={styles.formGroup}>
          <label htmlFor="price_qualifier">Price Qualifier</label>
          <Select id="price_qualifier" name="price_qualifier" value={formData.price_qualifier} onChange={onChange}>
            <option value="">None</option>
            <option value="POA">Price on Application</option>
            <option value="Guide Price">Guide Price</option>
            <option value="Fixed Price">Fixed Price</option>
            <option value="Offers Over">Offers Over</option>
            <option value="Offers Around">Offers Around</option>
          </Select>
        </FormGroup>

        {formData.category_id && categories.find((c) => c.id === Number(formData.category_id))?.name === "rent" && (
          <FormGroup className={styles.formGroup}>
            <label htmlFor="rent_frequency">Rent Frequency</label>
            <Select id="rent_frequency" name="rent_frequency" value={formData.rent_frequency} onChange={onChange}>
              <option value="monthly">Per Month</option>
              <option value="weekly">Per Week</option>
              <option value="quarterly">Per Quarter</option>
              <option value="annual">Per Year</option>
            </Select>
          </FormGroup>
        )}
      </div>

      <div className={styles.formRow}>
        <FormGroup className={styles.formGroup}>
          <label htmlFor="status">
            Status <span className={styles.required}>*</span>
          </label>
          <Select id="status" name="status" value={formData.status} onChange={onChange} required>
            <option value="available">Available</option>
            <option value="under_offer">Under Offer</option>
            <option value="let_agreed">Let Agreed</option>
            <option value="sold">Sold</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="draft">Draft</option>
          </Select>
        </FormGroup>

        <FormGroup className={styles.formGroup}>
          <label htmlFor="available_date">
            Available Date{" "}
            {formData.category_id && categories.find((c) => c.id === Number(formData.category_id))?.name === "rent" && (
              <span className={styles.required}>*</span>
            )}
          </label>
          <Input
            type="date"
            id="available_date"
            name="available_date"
            value={formData.available_date}
            onChange={onChange}
            required={
              formData.category_id && categories.find((c) => c.id === Number(formData.category_id))?.name === "rent"
            }
          />
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup className={styles.formGroup}>
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" name="featured" checked={formData.featured} onCheckedChange={(checked) => onCheckboxChange({ target: { name: 'featured', checked } } as any)} />
            <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Featured Property (will be highlighted on the website)</label>
          </div>
        </FormGroup>
      </div>

      <div className={styles.formRow}>
        <FormGroup className={styles.formGroup}>
          <label htmlFor="description">
            Property Description <span className={styles.required}>*</span>
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={6}
            placeholder="Provide a detailed description of the property..."
            required
          />
        </FormGroup>
      </div>
    </div>
  )
}
