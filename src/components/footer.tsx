"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import NewsletterSignup from "@/components/newsletter-signup"
import { useTranslation } from "@/hooks/use-translation"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <footer className="bg-muted py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("AI Vision")}</h3>
            <p className="text-muted-foreground">
              {t("Transforming industries with cutting-edge AI solutions for object detection and text-to-speech.")}
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("Quick Links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Home")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Services")}
                </Link>
              </li>
              <li>
                <Link href="/demos" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Demos")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Blog")}
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Portfolio")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("Contact Us")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">info@aivision.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">123 AI Boulevard, Tech District, San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("Stay Updated")}</h3>
            <p className="text-muted-foreground">
              {t("Subscribe to our newsletter for the latest AI insights and updates.")}
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {t("AI Vision")}. {t("All rights reserved.")}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("Privacy Policy")}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("Terms of Service")}
              </Link>
              <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("Sitemap")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
