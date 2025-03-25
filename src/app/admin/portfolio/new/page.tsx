"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewPortfolioItemPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    full_description: "",
    client: "",
    image_url: "/placeholder.svg?height=400&width=600",
    tags: [""],
    category: "",
    results: [""],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData((prev) => ({ ...prev, tags: newTags }))
  }

  const handleResultChange = (index: number, value: string) => {
    const newResults = [...formData.results]
    newResults[index] = value
    setFormData((prev) => ({ ...prev, results: newResults }))
  }

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }))
  }

  const removeTag = (index: number) => {
    const newTags = [...formData.tags]
    newTags.splice(index, 1)
    setFormData((prev) => ({ ...prev, tags: newTags }))
  }

  const addResult = () => {
    setFormData((prev) => ({ ...prev, results: [...prev.results, ""] }))
  }

  const removeResult = (index: number) => {
    const newResults = [...formData.results]
    newResults.splice(index, 1)
    setFormData((prev) => ({ ...prev, results: newResults }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty tags and results
      const filteredTags = formData.tags.filter((tag) => tag.trim() !== "")
      const filteredResults = formData.results.filter((result) => result.trim() !== "")

      // Convert form data to FormData object
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("full_description", formData.full_description)
      data.append("client", formData.client)
      data.append("image_url", formData.image_url)
      data.append("tags", JSON.stringify(filteredTags))
      data.append("category", formData.category)
      data.append("results", JSON.stringify(filteredResults))

      // Send request to create portfolio item
      const response = await fetch("/api/portfolio", {
        method: "POST",
        body: data,
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Portfolio item created successfully",
        })
        router.push("/admin/portfolio")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create portfolio item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating portfolio item:", error)
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
        <h1 className="text-3xl font-bold">Create New Portfolio Item</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for this portfolio item.</CardDescription>
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
                    placeholder="Enter portfolio item title"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    placeholder="Client name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="object-detection">Object Detection</SelectItem>
                      <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
                      <SelectItem value="custom-integration">Custom Integration</SelectItem>
                      <SelectItem value="real-time-processing">Real-time Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="URL to portfolio item image"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Provide details about this portfolio item.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description (displayed in cards)"
                    rows={2}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="full_description">Full Description</Label>
                  <Textarea
                    id="full_description"
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleChange}
                    placeholder="Detailed description of the portfolio item"
                    rows={6}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to categorize this portfolio item.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder={`Tag ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTag(index)}
                      disabled={formData.tags.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTag} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>List the outcomes or results achieved with this project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.results.map((result, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={result}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      placeholder={`Result ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeResult(index)}
                      disabled={formData.results.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addResult} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Result
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
                  Save Portfolio Item
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

