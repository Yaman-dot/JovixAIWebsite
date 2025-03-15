"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Loader2 } from "lucide-react"
import { fetchAllBlogPosts, deleteBlogPostById } from "@/lib/actions/blog-actions"
import { useToast } from "@/hooks/use-toast"

export default function BlogPostsPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    setLoading(true)
    try {
      const result = await fetchAllBlogPosts()
      if (result.success) {
        setBlogPosts(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load blog posts",
          variant: "destructive",
        })
        setBlogPosts([])
      }
    } catch (error) {
      console.error("Error loading blog posts:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return
    }

    try {
      const result = await deleteBlogPostById(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        })
        loadBlogPosts()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete blog post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Blog Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>View and manage all blog posts. You can edit, delete, or create new posts.</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No blog posts found</p>
              <Button asChild className="mt-4">
                <Link href="/admin/blog/new">Create your first blog post</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author_name || "Unknown"}</TableCell>
                      <TableCell>{post.category || "Uncategorized"}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/blog/edit/${post.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

