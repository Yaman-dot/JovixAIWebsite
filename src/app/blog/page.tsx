"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function BlogPage() {
  const { t } = useTranslation()

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "technology", name: "Technology" },
    { id: "ai-research", name: "AI Research" },
    { id: "business", name: "Business" },
    { id: "case-studies", name: "Case Studies" },
  ]

  const blogPosts = [
    {
      id: 1,
      title: "Advancements in Object Detection Technology",
      excerpt: "Exploring the latest breakthroughs in AI-powered object detection and their real-world applications.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
      date: "May 15, 2023",
      author: "Dr. Sarah Chen",
      category: "Technology",
      image: "/placeholder.svg?height=300&width=600",
      slug: "advancements-in-object-detection",
      readTime: "8 min read",
    },
    {
      id: 2,
      title: "The Evolution of Text-to-Speech Models",
      excerpt: "How modern TTS systems are revolutionizing accessibility and content consumption.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
      date: "April 28, 2023",
      author: "Michael Rodriguez",
      category: "AI Research",
      image: "/placeholder.svg?height=300&width=600",
      slug: "evolution-of-text-to-speech",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "Implementing AI in Enterprise Solutions",
      excerpt: "A guide to successfully integrating AI technologies into your business operations.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
      date: "April 10, 2023",
      author: "Jennifer Park",
      category: "Business",
      image: "/placeholder.svg?height=300&width=600",
      slug: "implementing-ai-enterprise-solutions",
      readTime: "10 min read",
    },
    {
      id: 4,
      title: "Real-time Object Detection for Retail Security",
      excerpt: "How AI-powered surveillance systems are transforming loss prevention in retail environments.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
      date: "March 22, 2023",
      author: "Robert Johnson",
      category: "Case Studies",
      image: "/placeholder.svg?height=300&width=600",
      slug: "real-time-object-detection-retail",
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "The Future of Voice Synthesis in Media",
      excerpt:
        "Exploring how text-to-speech technology is changing content creation in podcasts, audiobooks, and more.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
      date: "March 15, 2023",
      author: "Emma Williams",
      category: "Technology",
      image: "/placeholder.svg?height=300&width=600",
      slug: "future-voice-synthesis-media",
      readTime: "9 min read",
    },
    {
      id: 6,
      title: "Ethical Considerations in AI Development",
      excerpt: "Addressing the moral and ethical challenges of creating increasingly sophisticated AI systems.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
      date: "February 28, 2023",
      author: "Dr. David Kim",
      category: "AI Research",
      image: "/placeholder.svg?height=300&width=600",
      slug: "ethical-considerations-ai-development",
      readTime: "12 min read",
    },
  ]

  const featuredPost = blogPosts[0]
  const regularPosts = blogPosts.slice(1)

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("Blog & Insights")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("Stay updated with the latest trends, research, and applications in AI technology.")}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("Search articles...")} className="pl-10" />
          </div>
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="relative h-[300px] md:h-[400px] w-full">
              <Image
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">{t("Featured")}</Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline">{featuredPost.category}</Badge>
                <div className="text-sm text-muted-foreground">
                  {featuredPost.date} · {featuredPost.readTime}
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">
                <Link href={`/blog/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                  {featuredPost.title}
                </Link>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {t("By")} {featuredPost.author}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">{featuredPost.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/blog/${featuredPost.slug}`}>{t("Read Article")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Regular Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="text-xs text-muted-foreground">{post.readTime}</div>
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  {post.date} · {t("By")} {post.author}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base">{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`} className="text-primary font-medium hover:underline">
                  {t("Read more")}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              {t("Previous")}
            </Button>
            <Button variant="outline" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">{t("Next")}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

