"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

interface TemplateManagerProps {
  templates: string[]
  onAddTemplate: (template: string) => void
  onRemoveTemplate: (index: number) => void
}

export function TemplateManager({ templates, onAddTemplate, onRemoveTemplate }: Readonly<TemplateManagerProps>) {
  // Ensure templateUrl is never undefined in the template manager
  const [templateUrl, setTemplateUrl] = useState("")
  const [templateFile, setTemplateFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [isValidImage, setIsValidImage] = useState(false)
  const [open, setOpen] = useState(false)

  // Validate image when URL or file changes
  useEffect(() => {
    if (previewUrl) {
      const img = new Image()
      img.onload = () => setIsValidImage(true)
      img.onerror = () => setIsValidImage(false)
      img.src = previewUrl
    } else {
      setIsValidImage(false)
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setTemplateFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setTemplateUrl("") // Clear URL input when file is selected
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value || ""
    setTemplateUrl(url)
    if (url) {
      setPreviewUrl(url)
      setTemplateFile(null) // Clear file input when URL is entered
    } else {
      setPreviewUrl("")
    }
  }

  const handleSubmit = () => {
    if (!isValidImage) {
      alert("Please provide a valid image URL or file")
      return
    }

    if (previewUrl) {
      onAddTemplate(previewUrl)
      setOpen(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setTemplateUrl("")
    setTemplateFile(null)
    setPreviewUrl("")
    setIsValidImage(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-[#800000] hover:bg-[#900000] text-white">
        <Plus className="mr-2 h-4 w-4" /> Add Template
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) resetForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Certificate Template</DialogTitle>
            <DialogDescription>
              Upload a new certificate template or provide a URL to an existing template.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-url">Template URL</Label>
              {/* Update the Input component to ensure value is never undefined */}
              <Input
                id="template-url"
                placeholder="https://example.com/template.png"
                value={templateUrl}
                onChange={handleUrlChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="template-file">Or upload a template</Label>
              <div className="flex items-center gap-2">
                <Input id="template-file" type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
                {templateFile && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setTemplateFile(null)
                      setPreviewUrl("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {previewUrl && (
              <div className="mt-2">
                <Label>Preview</Label>
                <div className="mt-1 border rounded-md overflow-hidden">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Template Preview"
                    className="w-full h-auto max-h-[200px] object-contain"
                    onError={() => setIsValidImage(false)}
                    onLoad={() => setIsValidImage(true)}
                  />
                </div>
                {!isValidImage && (
                  <p className="text-sm text-red-500 mt-1">Invalid image. Please provide a valid image URL or file.</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!previewUrl || !isValidImage}
              className={!previewUrl || !isValidImage ? "opacity-50 cursor-not-allowed" : ""}
            >
              Add Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

