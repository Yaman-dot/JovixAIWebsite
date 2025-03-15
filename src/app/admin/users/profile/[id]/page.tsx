"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Edit, Loader2, Mail, UserIcon } from "lucide-react"
import { fetchUserById, fetchUserActivity } from "@/lib/actions/user-actions"
import { useToast } from "@/hooks/use-toast"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = Number.parseInt(params.id)
        if (isNaN(id)) {
          toast({
            title: "Error",
            description: "Invalid user ID",
            variant: "destructive",
          })
          router.push("/admin/users")
          return
        }

        // Fetch user data
        const userResult = await fetchUserById(id)
        if (!userResult.success) {
          toast({
            title: "Error",
            description: userResult.error || "Failed to load user",
            variant: "destructive",
          })
          router.push("/admin/users")
          return
        }

        setUser(userResult.data)

        // Fetch user activity
        const activityResult = await fetchUserActivity(id)
        if (activityResult.success) {
          setActivities(activityResult.data || [])
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [params.id, router, toast])

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "editor":
        return "default"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="text-muted-foreground mt-2">The requested user could not be found.</p>
        <Button className="mt-4" onClick={() => router.push("/admin/users")}>
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic details about the user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={user.profile_image || "/placeholder.svg?height=200&width=200"}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <Badge variant={getRoleBadgeVariant(user.role)} className="mt-2">
                {user.role}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Joined</p>
                  <p className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {user.bio && (
                <div className="flex items-start gap-2">
                  <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Bio</p>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={() => router.push(`/admin/users/edit/${user.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Activity and Content Tabs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Recent actions and content from this user</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity">
              <TabsList className="mb-4">
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
                <TabsTrigger value="content">User Content</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No activity recorded for this user yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-3 border-b pb-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="content">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">User content will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

