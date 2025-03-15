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
import { fetchAllPortfolioItems, deletePortfolioItemById } from "@/lib/actions/portfolio-actions"
import { useToast } from "@/hooks/use-toast"

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadPortfolioItems()
  }, [])

  const loadPortfolioItems = async () => {
    setLoading(true)
    try {
      const result = await fetchAllPortfolioItems()
      if (result.success) {
        setPortfolioItems(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load portfolio items",
          variant: "destructive",
        })
        setPortfolioItems([])
      }
    } catch (error) {
      console.error("Error loading portfolio items:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setPortfolioItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) {
      return
    }

    try {
      const result = await deletePortfolioItemById(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Portfolio item deleted successfully",
        })
        loadPortfolioItems()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete portfolio item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const filteredItems = portfolioItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Manage your portfolio items</p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="mr-2 h-4 w-4" />
            New Portfolio Item
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Portfolio Items</CardTitle>
          <CardDescription>
            View and manage all portfolio items. You can edit, delete, or create new items.
          </CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search portfolio items..."
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
          ) : portfolioItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No portfolio items found</p>
              <Button asChild className="mt-4">
                <Link href="/admin/portfolio/new">Create your first portfolio item</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.client || "—"}</TableCell>
                      <TableCell>{item.category || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.tags && item.tags.length > 0
                            ? item.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {tag}
                                </Badge>
                              ))
                            : "—"}
                          {item.tags && item.tags.length > 3 && (
                            <Badge variant="outline">+{item.tags.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
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
                              <Link href="/portfolio">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/portfolio/edit/${item.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
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

