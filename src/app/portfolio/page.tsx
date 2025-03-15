"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"

export default function PortfolioPage() {
  const { t } = useTranslation()

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "object-detection", name: "Object Detection" },
    { id: "text-to-speech", name: "Text-to-Speech" },
    { id: "custom-integration", name: "Custom Integration" },
  ]

  const portfolioItems = [
    {
      id: 1,
      title: "Retail Security System",
      description: "AI-powered object detection for retail security and inventory management.",
      fullDescription:
        "A comprehensive security system for retail environments that uses object detection to identify suspicious behavior, prevent theft, and track inventory in real-time.",
      client: "Major Retail Chain",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Object Detection", "Retail", "Security"],
      category: "object-detection",
      results: [
        "30% reduction in inventory shrinkage",
        "Improved staff allocation efficiency",
        "Real-time alerts for security incidents",
      ],
    },
    {
      id: 2,
      title: "Audiobook Production Suite",
      description: "Text-to-speech platform for publishers creating high-quality audiobooks.",
      fullDescription:
        "A complete audiobook production platform that converts manuscripts into natural-sounding narration, reducing production costs and time-to-market for publishers.",
      client: "Publishing House Consortium",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Text-to-Speech", "Publishing", "Audio"],
      category: "text-to-speech",
      results: ["90% reduction in production costs", "8x faster time-to-market", "Expanded audiobook catalog by 300%"],
    },
    {
      id: 3,
      title: "Traffic Monitoring System",
      description: "Real-time object detection for smart city traffic management.",
      fullDescription:
        "An intelligent traffic monitoring system that uses object detection to analyze traffic patterns, detect incidents, and optimize signal timing for improved urban mobility.",
      client: "Metropolitan Transportation Authority",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Object Detection", "Smart City", "Real-time"],
      category: "object-detection",
      results: [
        "25% reduction in average commute times",
        "40% decrease in traffic congestion",
        "Faster emergency response coordination",
      ],
    },
    {
      id: 4,
      title: "Multilingual Customer Service Voice Bot",
      description: "Text-to-speech solution for automated customer service in multiple languages.",
      fullDescription:
        "An advanced voice bot system that provides natural-sounding customer service in 12 languages, handling common inquiries and seamlessly escalating to human agents when needed.",
      client: "International Hotel Chain",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Text-to-Speech", "Customer Service", "Multilingual"],
      category: "text-to-speech",
      results: ["24/7 customer support coverage", "Support for 12 languages", "40% reduction in call center costs"],
    },
    {
      id: 5,
      title: "Manufacturing Quality Control",
      description: "Object detection system for identifying defects in production lines.",
      fullDescription:
        "A precision quality control system that uses object detection to identify manufacturing defects in real-time, improving product quality and reducing waste.",
      client: "Automotive Parts Manufacturer",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Object Detection", "Manufacturing", "Quality Control"],
      category: "object-detection",
      results: [
        "99.8% defect detection rate",
        "75% reduction in quality control staff costs",
        "Decreased product returns by 45%",
      ],
    },
    {
      id: 6,
      title: "Healthcare Records Integration",
      description: "Custom AI integration for medical records and diagnostic imaging.",
      fullDescription:
        "A seamless integration solution that connects electronic health records with AI-powered diagnostic tools, improving clinical decision-making and patient outcomes.",
      client: "Regional Hospital Network",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Custom Integration", "Healthcare", "Diagnostics"],
      category: "custom-integration",
      results: [
        "35% faster diagnosis times",
        "Improved cross-department collaboration",
        "Comprehensive patient history access",
      ],
    },
  ]

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("Our Portfolio")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("Explore our successful AI implementations across various industries and use cases.")}
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="mb-12">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* All Projects */}
          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          {/* Filtered Categories */}
          {categories.slice(1).map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <PortfolioCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA Section */}
        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">{t("Ready to Build Your AI Solution?")}</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t(
              "Contact our team to discuss how our AI expertise can help solve your business challenges and create new opportunities.",
            )}
          </p>
          <Button asChild size="lg">
            <Link href="/contact">{t("Start Your Project")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

interface PortfolioCardProps {
  item: {
    id: number
    title: string
    description: string
    fullDescription: string
    client: string
    image: string
    tags: string[]
    category: string
    results: string[]
  }
}

function PortfolioCard({ item }: PortfolioCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-6">
          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
          <p className="text-sm text-center mb-4">{item.fullDescription}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {item.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-white/20 text-white border-none">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="text-sm">
            <div className="font-medium mb-1">{t("Results")}:</div>
            <ul className="list-disc list-inside text-left">
              {item.results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <CardContent className="p-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">{item.title}</h3>
          <Badge
            variant="outline"
            className="group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground group-hover:border-primary-foreground/20"
          >
            {item.client}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

