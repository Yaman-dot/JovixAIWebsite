"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DemoPreviewProps {
  title: string
  description: string
  icon: LucideIcon
  link: string
}

export default function DemoPreview({ title, description, icon: Icon, link }: DemoPreviewProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={link}>Try Demo</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

