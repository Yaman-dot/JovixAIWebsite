"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart, PieChart, Calendar, Download } from "lucide-react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30days")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your website performance and user engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Traffic Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Website visits and page views over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <LineChart className="h-16 w-16" />
            <span className="ml-4">Traffic chart visualization would appear here</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-xs text-muted-foreground">Total Visitors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">32,891</div>
                <p className="text-xs text-muted-foreground">Page Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">2:45</div>
                <p className="text-xs text-muted-foreground">Avg. Session Duration</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">42.3%</div>
                <p className="text-xs text-muted-foreground">Bounce Rate</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <PieChart className="h-16 w-16" />
              <span className="ml-4">Traffic sources chart would appear here</span>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Direct</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "42%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Search</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "28%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Social</span>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "18%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Referral</span>
                <span className="text-sm font-medium">12%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Content</CardTitle>
            <CardDescription>Most viewed pages and content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <BarChart className="h-16 w-16" />
              <span className="ml-4">Popular content chart would appear here</span>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Homepage</span>
                <span className="text-sm">8,245 views</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Object Detection Demo</span>
                <span className="text-sm">5,128 views</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Text-to-Speech Demo</span>
                <span className="text-sm">3,879 views</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Blog: AI Advancements</span>
                <span className="text-sm">2,543 views</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Services Page</span>
                <span className="text-sm">1,987 views</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>User Demographics</CardTitle>
          <CardDescription>Information about your audience</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="location">
            <TabsList className="mb-4">
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="browsers">Browsers</TabsTrigger>
            </TabsList>

            <TabsContent value="location">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground border rounded-md">
                  <span>World map visualization would appear here</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">United States</span>
                    <span className="text-sm">42%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">United Kingdom</span>
                    <span className="text-sm">15%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Germany</span>
                    <span className="text-sm">8%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">India</span>
                    <span className="text-sm">7%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Canada</span>
                    <span className="text-sm">6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Other</span>
                    <span className="text-sm">22%</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="devices">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-16 w-16" />
                  <span className="ml-4">Device distribution chart would appear here</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Desktop</span>
                    <span className="text-sm">48%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Mobile</span>
                    <span className="text-sm">42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tablet</span>
                    <span className="text-sm">10%</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="browsers">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <BarChart className="h-16 w-16" />
                  <span className="ml-4">Browser usage chart would appear here</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Chrome</span>
                    <span className="text-sm">64%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Safari</span>
                    <span className="text-sm">18%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Firefox</span>
                    <span className="text-sm">8%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Edge</span>
                    <span className="text-sm">7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Other</span>
                    <span className="text-sm">3%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

