"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface PortfolioItemProps {
  item: {
    id: number
    title: string
    description: string
    image: string
    tags: string[]
  }
}

export default function PortfolioItem({ item }: PortfolioItemProps) {
  const { title, description, image, tags } = item

  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-center mb-4">{description}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-white/20 text-white border-none">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <CardContent className="p-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        <h3 className="font-bold">{title}</h3>
      </CardContent>
    </Card>
  )
}

