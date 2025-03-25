"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useTranslation } from "@/hooks/use-translation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, ShieldCheck, LogOut } from "lucide-react"
import { logoutAction } from "@/lib/actions/auth-actions"
import { useToast } from "@/hooks/use-toast"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()
  const { language, setLanguage, t } = useTranslation()
  const { toast } = useToast()

  // Add state and functions for user authentication
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/auth/check")
        const data = await response.json()

        if (data.authenticated && data.user) {
          setCurrentUser(data.user)
        } else {
          setCurrentUser(null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setCurrentUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await logoutAction()
      setCurrentUser(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  useEffect(() => {
    // Close menu when route changes
    closeMenu()
  }, [pathname])

  const navItems = [
    { name: t("Home"), path: "/" },
    { name: t("Services"), path: "/services" },
    { name: t("Demos"), path: "/demos" },
    { name: t("Blog"), path: "/blog" },
    { name: t("Portfolio"), path: "/portfolio" },
    { name: t("Contact"), path: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{t("JovixAI")}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.path ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Sign In/Profile Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded-md"></div>
            ) : currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={currentUser.profile_image || "/images/default-avatar.png"}
                        alt={currentUser.name}
                      />
                      <AvatarFallback>{currentUser.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span>{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {t("My Profile")}
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {t("Admin Panel")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("Sign Out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth">{t("Sign In")}</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/auth">{t("Sign Up")}</Link>
                </Button>
              </>
            )}
          </div>
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="h-4 w-4" />
                <span className="sr-only">{t("Switch language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => changeLanguage("en")}
                className={cn("cursor-pointer", language === "en" && "font-bold")}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeLanguage("ar")}
                className={cn("cursor-pointer", language === "ar" && "font-bold")}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t("Toggle theme")}</span>
          </Button>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{t("Toggle menu")}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && isMobile && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm border-t md:hidden">
          <nav className="container flex flex-col gap-6 p-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === item.path ? "text-primary" : "text-muted-foreground",
                )}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              {isLoading ? (
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
              ) : currentUser ? (
                <>
                  <Link
                    href="/profile"
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center justify-center"
                    onClick={closeMenu}
                  >
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("My Profile")}
                    </Button>
                  </Link>
                  {currentUser.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-lg font-medium transition-colors hover:text-primary flex items-center justify-center"
                      onClick={closeMenu}
                    >
                      <Button
                        variant="secondary"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {t("Admin Panel")}
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2"
                    onClick={() => {
                      handleLogout()
                      closeMenu()
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("Sign Out")}
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center justify-center"
                    onClick={closeMenu}
                  >
                    <Button variant="outline" className="w-full">
                      {t("Sign In")}
                    </Button>
                  </Link>
                  <Link
                    href="/auth"
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center justify-center"
                    onClick={closeMenu}
                  >
                    <Button
                      variant="secondary"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {t("Sign Up")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

