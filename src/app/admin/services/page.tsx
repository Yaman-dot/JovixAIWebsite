"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Loader2 } from "lucide-react"
import { fetchAllServices, deleteServiceById } from "@/lib/actions/service-actions"
import { useToast } from "@/hooks/use-toast"

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const result = await fetchAllServices()
      if (result.success) {
        setServices(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load services",
          variant: "destructive",
        })
        setServices([])
      }
    } catch (error) {
      console.error("Error loading services:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return
    }

    try {
      const result = await deleteServiceById(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        })
        loadServices()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete service",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            New Service
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>View and manage all services. You can edit, delete, or create new services.</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
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
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No services found</p>
              <Button asChild className="mt-4">
                <Link href="/admin/services/new">Create your first service</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {service.description || "No description"}
                      </TableCell>
                      <TableCell>{service.icon || "—"}</TableCell>
                      <TableCell>{new Date(service.created_at).toLocaleDateString()}</TableCell>
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
                              <Link href={`/services/${service.slug}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/services/edit/${service.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-red-600">
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

