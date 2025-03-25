"use client"

import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Facebook, Twitter, Linkedin } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useState, useEffect } from "react"

// Fix the React.use() warning for params
import { use } from "react"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params)
  const { t } = useTranslation()
  const { slug } = resolvedParams
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog/${slug}`)

        if (!response.ok) {
          if (response.status === 404) {
            return notFound()
          }
          throw new Error(`Failed to fetch blog post: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setPost(data.post)
        } else {
          throw new Error(data.error || "Failed to fetch blog post")
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [slug])

  // Show loading state
  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show error state
  if (error || !post) {
    return notFound()
  }

  // Related posts (in a real app, these would be algorithmically determined)
  const relatedPosts = [
    {
      title: "Implementing AI in Enterprise Solutions",
      excerpt: "A guide to successfully integrating AI technologies into your business operations.",
      date: "April 10, 2023",
      image: "/placeholder.svg?height=200&width=300",
      slug: "implementing-ai-enterprise-solutions",
      readTime: "10 min read",
    },
    {
      title: "Real-time Object Detection for Retail Security",
      excerpt: "How AI-powered surveillance systems are transforming loss prevention in retail environments.",
      date: "March 22, 2023",
      image: "/placeholder.svg?height=200&width=300",
      slug: "real-time-object-detection-retail",
      readTime: "7 min read",
    },
  ]

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("Back to Blog")}
          </Link>
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge>{post.category}</Badge>
            <span className="text-sm text-muted-foreground">•</span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image src={post.authorImage || "/placeholder.svg"} alt={post.author} fill className="object-cover" />
              </div>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Share Section */}
        <div className="border-t border-b py-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-lg font-medium">{t("Share this article")}</div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image src={post.authorImage || "/placeholder.svg"} alt={post.author} fill className="object-cover" />
              </div>
              <div>
                <CardTitle>{post.author}</CardTitle>
                <div className="text-sm text-muted-foreground">{post.authorTitle}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{post.authorBio}</p>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("Related Articles")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image
                    src={relatedPost.image || "/placeholder.svg"}
                    alt={relatedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {relatedPost.date} · {relatedPost.readTime}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">{t("Stay Updated with Our Latest Insights")}</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t(
              "Subscribe to our newsletter to receive the latest articles, research findings, and industry insights directly in your inbox.",
            )}
          </p>
          <Button asChild size="lg">
            <Link href="/contact">{t("Subscribe Now")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

