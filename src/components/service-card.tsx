"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ServiceCardProps {
  service: {
    id: number
    title: string
    description: string
    icon: LucideIcon
    link: string
  }
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, icon: Icon, link } = service

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="p-0 h-auto" asChild>
          <Link href={link} className="text-primary font-medium hover:underline">
            Learn more
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

