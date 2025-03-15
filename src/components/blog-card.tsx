"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
  post: {
    id: number
    title: string
    excerpt: string
    date: string
    category: string
    image: string
    slug: string
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  const { title, excerpt, date, category, image, slug } = post

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{category}</Badge>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <CardTitle className="text-xl">
          <Link href={`/blog/${slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{excerpt}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${slug}`} className="text-primary font-medium hover:underline">
          Read more
        </Link>
      </CardFooter>
    </Card>
  )
}

