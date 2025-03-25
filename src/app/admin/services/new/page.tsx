"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Save, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewServicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "",
    features: [""],
    use_cases: [""],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const handleUseCaseChange = (index: number, value: string) => {
    const newUseCases = [...formData.use_cases]
    newUseCases[index] = value
    setFormData((prev) => ({ ...prev, use_cases: newUseCases }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features]
    newFeatures.splice(index, 1)
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const addUseCase = () => {
    setFormData((prev) => ({ ...prev, use_cases: [...prev.use_cases, ""] }))
  }

  const removeUseCase = (index: number) => {
    const newUseCases = [...formData.use_cases]
    newUseCases.splice(index, 1)
    setFormData((prev) => ({ ...prev, use_cases: newUseCases }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty features and use cases
      const filteredFeatures = formData.features.filter((feature) => feature.trim() !== "")
      const filteredUseCases = formData.use_cases.filter((useCase) => useCase.trim() !== "")

      // Convert form data to FormData object
      const data = new FormData()
      data.append("title", formData.title)
      data.append("slug", formData.slug)
      data.append("description", formData.description)
      data.append("icon", formData.icon)
      data.append("features", JSON.stringify(filteredFeatures))
      data.append("use_cases", JSON.stringify(filteredUseCases))

      // Send request to create service
      const response = await fetch("/api/services", {
        method: "POST",
        body: data,
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Service created successfully",
        })
        router.push("/admin/services")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create service",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating service:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Service</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Enter the basic information for your new service.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter service title"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="enter-service-slug"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the service"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="e.g., Eye, Mic, Cpu, Zap"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter a Lucide icon name. See{" "}
                    <a
                      href="https://lucide.dev/icons/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Lucide Icons
                    </a>{" "}
                    for options.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>List the key features of this service.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>List potential use cases for this service.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.use_cases.map((useCase, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={useCase}
                      onChange={(e) => handleUseCaseChange(index, e.target.value)}
                      placeholder={`Use Case ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeUseCase(index)}
                      disabled={formData.use_cases.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addUseCase} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Use Case
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Service
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

