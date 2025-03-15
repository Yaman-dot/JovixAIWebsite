"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LineChart, Users, FileText, Package, Briefcase, ArrowUpRight, ArrowDownRight, Plus, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { initDatabaseAction, fetchStats } from "@/lib/actions/admin-actions"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: { count: 0, loading: true },
    blogPosts: { count: 0, loading: true },
    services: { count: 0, loading: true },
    portfolioItems: { count: 0, loading: true },
    dbInitialized: false,
    initializing: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch counts from database using server action
        const result = await fetchStats()
        
        if (result.success) {
          setStats((prev) => ({
            ...prev,
            users: {
              count: result.data.users,
              loading: false,
            },
            blogPosts: {
              count: result.data.blogPosts,
              loading: false,
            },
            services: {
              count: result.data.services,
              loading: false,
            },
            portfolioItems: {
              count: result.data.portfolioItems,
              loading: false,
            },
            dbInitialized: true,
          }))
        } else {
          setStats((prev) => ({
            ...prev,
            users: { count: 0, loading: false },
            blogPosts: { count: 0, loading: false },
            services: { count: 0, loading: false },
            portfolioItems: { count: 0, loading: false },
            dbInitialized: false,
          }))
        }
      } catch (error) {
        console.error("Error loading stats:", error)
        setStats((prev) => ({
          ...prev,
          users: { count: 0, loading: false },
          blogPosts: { count: 0, loading: false },
          services: { count: 0, loading: false },
          portfolioItems: { count: 0, loading: false },
          dbInitialized: false,
        }))
      }
    }

    loadStats()
  }, [stats.dbInitialized])

  const handleInitDatabase = async () => {
    setStats((prev) => ({ ...prev, initializing: true }))
    try {
      const result = await initDatabaseAction()
      if (result.success) {
        setStats((prev) => ({ ...prev, dbInitialized: true, initializing: false }))
        toast({
          title: "Success",
          description: "Database initialized successfully",
        })
      } else {
        setStats((prev) => ({ ...prev, initializing: false }))
        toast({
          title: "Error",
          description: result.error || "Failed to initialize database",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      setStats((prev) => ({ ...prev, initializing: false }))
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin User</p>
        </div>
        <div className="flex gap-2">
          {!stats.dbInitialized && (
            <Button onClick={handleInitDatabase} disabled={stats.initializing}>
              {stats.initializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing Database...
                </>
              ) : (
                "Initialize Database"
              )}
            </Button>
          )}
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Blog Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.users.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.users.count}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12%
                  </span>
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.blogPosts.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.blogPosts.count}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8%
                  </span>
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.services.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.services.count}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    4%
                  </span>
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.portfolioItems.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.portfolioItems.count}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-red-500 flex items-center mr-1">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    2%
                  </span>
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <Tabs defaultValue="traffic">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>

        <TabsContent value="traffic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Daily unique visitors over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <LineChart className="h-16 w-16" />
                <span className="ml-4">Traffic visualization chart would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>User interaction metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <LineChart className="h-16 w-16" />
                <span className="ml-4">Engagement visualization chart would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rates</CardTitle>
              <CardDescription>Visitor to customer conversion metrics</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <LineChart className="h-16 w-16" />
                <span className="ml-4">Conversion visualization chart would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm">New user registered</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm">Blog post "Advancements in Object Detection" published</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="flex-1">
                <p className="text-sm">Service "Text-to-Speech Solutions" updated</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div className="flex-1">
                <p className="text-sm">New portfolio item "Retail Security System" added</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
