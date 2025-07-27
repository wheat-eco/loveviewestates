
"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X } from "lucide-react"
import styles from "../PropertyForm.module.css"

interface DocumentsFormProps {
  documents: { [key: string]: File | null }
  onChange: (type: string, file: File | null) => void
  propertyCategory: string
}

export function DocumentsForm({ documents, onChange, propertyCategory }: DocumentsFormProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const documentTypes = [
    { key: "epc", label: "Energy Performance Certificate", accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "floorplan", label: "Floor Plan", accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "brochure", label: "Property Brochure", accept: ".pdf" },
    ...(propertyCategory === "sale"
      ? [
          { key: "title_deed", label: "Title Deed", accept: ".pdf" },
          { key: "lease_agreement", label: "Lease Agreement", accept: ".pdf" },
        ]
      : []),
    ...(propertyCategory === "rent"
      ? [{ key: "tenancy_agreement", label: "Tenancy Agreement Template", accept: ".pdf" }]
      : []),
  ]

  const handleFileSelect = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(type, file)
  }

  const handleRemoveDocument = (type: string) => {
    onChange(type, null)
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={styles.formSection}>
      <h2>Property Documents</h2>

      <p className={styles.helpText}>
        Upload relevant documents for the property. These will be available for download by interested parties.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {documentTypes.map((docType) => (
          <div key={docType.key} className="border p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText size={16} /> {docType.label}
              </h4>
              {documents[docType.key] && (
                 <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDocument(docType.key)}
                    title="Remove document"
                    className="h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
              )}
            </div>

            {documents[docType.key] ? (
              <div className="text-sm text-gray-600">
                <p className="font-medium truncate">{documents[docType.key]!.name}</p>
                <p className="text-gray-500">{formatFileSize(documents[docType.key]!.size)}</p>
              </div>
            ) : (
              <div>
                <input
                  ref={(el) => (fileInputRefs.current[docType.key] = el)}
                  type="file"
                  accept={docType.accept}
                  onChange={(e) => handleFileSelect(docType.key, e)}
                  style={{ display: "none" }}
                />

                <Button type="button" variant="outline" onClick={() => fileInputRefs.current[docType.key]?.click()}>
                  <Upload size={16} />
                  Upload File
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
