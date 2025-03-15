"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart, FileText, Briefcase, Settings, Package, Users, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Services", href: "/admin/services", icon: Package },
    { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span>AI Vision</span>
            <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Admin</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1.5">
            {navItems.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}

            <Separator className="my-4" />

            <p className="text-xs font-semibold text-muted-foreground px-4 py-2">CONTENT MANAGEMENT</p>

            {navItems.slice(2, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}

            <Separator className="my-4" />

            {navItems.slice(5).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 mt-auto border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin User" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@aivision.com</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/auth">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn("flex-1 transition-all duration-200 ease-in-out", sidebarOpen ? "md:ml-64" : "ml-0 md:ml-64")}
      >
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}

