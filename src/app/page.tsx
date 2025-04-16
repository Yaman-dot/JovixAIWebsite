"use client"

import Link from "next/link"
import { ArrowRight, ChevronRight, Cpu, Mic, Eye, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroAnimation from "@/components/hero-animation"
import ServiceCard from "@/components/service-card"
import DemoPreview from "@/components/demo-preview"
import BlogCard from "@/components/blog-card"
import PortfolioItem from "@/components/portfolio-item"
import NewsletterSignup from "@/components/newsletter-signup"
import { useTranslation } from "@/hooks/use-translation"

export default function Home() {
  const { t } = useTranslation()

  const services = [
    {
      id: 1,
      title: t("Object Detection Models"),
      description: t(
        "Advanced AI models that can identify and track objects in images and video streams with high accuracy.",
      ),
      icon: Eye,
      link: "/services/object-detection",
    },
    {
      id: 2,
      title: t("Text-to-Speech Solutions"),
      description: t("Natural-sounding voice synthesis technology that converts written text into lifelike speech."),
      icon: Mic,
      link: "/services/text-to-speech",
    },
    {
      id: 3,
      title: t("Custom AI Integration"),
      description: t("Tailored AI solutions integrated seamlessly into your existing systems and workflows."),
      icon: Cpu,
      link: "/services/custom-integration",
    },
    {
      id: 4,
      title: t("Real-time Processing"),
      description: t("High-performance AI processing for time-sensitive applications with minimal latency."),
      icon: Zap,
      link: "/services/real-time-processing",
    },
  ]

  /**const blogPosts = [
    {
      id: 1,
      title: "Advancements in Object Detection Technology",
      excerpt: "Exploring the latest breakthroughs in AI-powered object detection and their real-world applications.",
      date: "May 15, 2023",
      category: "Technology",
      image: "/placeholder.svg?height=200&width=400",
      slug: "advancements-in-object-detection",
    },
    {
      id: 2,
      title: "The Evolution of Text-to-Speech Models",
      excerpt: "How modern TTS systems are revolutionizing accessibility and content consumption.",
      date: "April 28, 2023",
      category: "AI Research",
      image: "/placeholder.svg?height=200&width=400",
      slug: "evolution-of-text-to-speech",
    },
    {
      id: 3,
      title: "Implementing AI in Enterprise Solutions",
      excerpt: "A guide to successfully integrating AI technologies into your business operations.",
      date: "April 10, 2023",
      category: "Business",
      image: "/placeholder.svg?height=200&width=400",
      slug: "implementing-ai-enterprise-solutions",
    },
  ]**/

  const portfolioItems = [
    {
      id: 1,
      title: "Retail Security System",
      description: "AI-powered object detection for retail security and inventory management.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Object Detection", "Retail", "Security"],
    },
    {
      id: 2,
      title: "Audiobook Production Suite",
      description: "Text-to-speech platform for publishers creating high-quality audiobooks.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Text-to-Speech", "Publishing", "Audio"],
    },
    {
      id: 3,
      title: "Traffic Monitoring System",
      description: "Real-time object detection for smart city traffic management.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Object Detection", "Smart City", "Real-time"],
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                {t("Advanced AI Solutions for")} <span className="text-primary">{t("Object Detection")}</span>{" "}
                {t("and")} <span className="text-primary">{t("Text-to-Speech")}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                {t(
                  "Transforming industries with cutting-edge artificial intelligence models that see, understand, and speak with human-like precision.",
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" className="gap-2">
                  {t("Try Our Demos")} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  {t("Explore Services")} <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] w-full">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("Our AI Services")}</h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              {t("Cutting-edge AI solutions designed to transform your business operations and customer experiences.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("Experience Our AI in Action")}</h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              {t("Try our interactive demos to see the power and precision of our AI models firsthand.")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DemoPreview
              title={t("Object Detection Demo")}
              description={t("Upload an image and watch our AI identify objects in real-time.")}
              icon={Eye}
              link="/demos/object-detection"
            />
            <DemoPreview
              title={t("Text-to-Speech Demo")}
              description={t("Convert your text into natural-sounding speech with our advanced AI models.")}
              icon={Mic}
              link="/demos/text-to-speech"
            />
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {/* <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("Latest Insights")}</h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              {t("Stay updated with the latest trends, research, and applications in AI technology.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">{t("View All Articles")}</Link>
            </Button>
          </div>
        </div>  
      </section> */}

      {/* Portfolio Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("Our Portfolio")}</h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              {t("Explore our successful AI implementations across various industries and use cases.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <PortfolioItem key={item.id} item={item} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/portfolio">{t("View All Projects")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t("Ready to Transform Your Business with AI?")}
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90">
                {t(
                  "Contact our team of experts to discuss how our AI solutions can address your specific needs and challenges.",
                )}
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">{t("Get in Touch")}</Link>
              </Button>
            </div>
            <div className="bg-primary-foreground/10 p-8 rounded-lg">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

