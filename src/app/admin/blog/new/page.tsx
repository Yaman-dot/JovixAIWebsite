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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { createNewBlogPost } from "@/lib/actions/blog-actions"
import { useToast } from "@/hooks/use-toast"

export default function NewBlogPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    image_url: "/placeholder.svg?height=600&width=1200",
    status: "draft",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert form data to FormData object
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })

      // Add author ID (in a real app, this would be the current user's ID)
      data.append("author_id", "1")

      const result = await createNewBlogPost(data)

      if (result.success) {
        toast({
          title: "Success",
          description: "Blog post created successfully",
        })
        router.push("/admin/blog")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create blog post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating blog post:", error)
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
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Details</CardTitle>
              <CardDescription>Enter the basic information for your new blog post.</CardDescription>
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
                    placeholder="Enter blog post title"
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
                    placeholder="enter-blog-post-slug"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief summary of the blog post"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="AI Research">AI Research</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Case Studies">Case Studies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image_url">Featured Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="URL to featured image"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write the content of your blog post.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="write">
                <TabsList className="mb-4">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your blog post content here..."
                    className="min-h-[300px]"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                    {formData.content ? (
                      <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br />") }} />
                    ) : (
                      <p className="text-muted-foreground">No content to preview</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
                  Save Blog Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

