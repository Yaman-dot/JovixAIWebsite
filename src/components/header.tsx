"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useTranslation } from "@/hooks/use-translation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()
  const { language, setLanguage, t } = useTranslation()

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
            <span className="text-2xl font-bold">{t("AI Vision")}</span>
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
          {/* Sign In and Admin Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth">{t("Sign In")}</Link>
            </Button>
            <Button variant="secondary" size="sm" asChild className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/admin">{t("Admin")}</Link>
            </Button>
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
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
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
                href="/admin"
                className="text-lg font-medium transition-colors hover:text-primary flex items-center justify-center"
                onClick={closeMenu}
              >
                <Button variant="secondary" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  {t("Admin")}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

