"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface PortfolioDetailPageProps {
  params: {
    id: string
  }
}

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const resolvedParams = use(params)
  const { t } = useTranslation()
  const router = useRouter()
  const id = Number.parseInt(resolvedParams.id)

  // This would come from a database in a real application
  const portfolioItems = [
    {
      id: 1,
      title: "Retail Security System",
      description: "AI-powered object detection for retail security and inventory management.",
      fullDescription:
        "A comprehensive security system for retail environments that uses object detection to identify suspicious behavior, prevent theft, and track inventory in real-time. The system integrates with existing CCTV infrastructure and provides real-time alerts to security personnel when suspicious activities are detected.\n\nThe AI models are trained to recognize specific patterns of behavior associated with shoplifting and other security concerns, while also tracking inventory levels on shelves to optimize restocking operations. This dual-purpose approach maximizes the return on investment for retailers.",
      client: "Major Retail Chain",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Object Detection", "Retail", "Security"],
      category: "object-detection",
      results: [
        "30% reduction in inventory shrinkage",
        "Improved staff allocation efficiency",
        "Real-time alerts for security incidents",
      ],
      challenge:
        "The client was experiencing significant losses due to theft and inefficient inventory management. Traditional security systems were reactive rather than proactive, and manual inventory checks were time-consuming and error-prone.",
      solution:
        "We implemented a custom object detection system that monitors store activity in real-time, identifying potential security threats and tracking inventory levels simultaneously. The system was integrated with the client's existing security infrastructure and inventory management software.",
      technologies: ["TensorFlow", "Computer Vision", "Edge Computing", "Cloud Analytics"],
      testimonial: {
        quote:
          "This system has transformed our loss prevention strategy. We're now able to prevent incidents before they occur, while also optimizing our inventory management.",
        author: "Director of Loss Prevention",
        company: "Major Retail Chain",
      },
    },
    {
      id: 2,
      title: "Audiobook Production Suite",
      description: "Text-to-speech platform for publishers creating high-quality audiobooks.",
      fullDescription:
        "A complete audiobook production platform that converts manuscripts into natural-sounding narration, reducing production costs and time-to-market for publishers. The system uses advanced neural text-to-speech models to generate lifelike narration in multiple voices and languages.\n\nPublishers can upload manuscripts, select from a library of voice profiles, adjust pronunciation and emphasis, and generate complete audiobooks in a fraction of the time and cost of traditional recording methods. The platform also includes quality assurance tools to ensure consistent audio quality throughout the production process.",
      client: "Publishing House Consortium",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Text-to-Speech", "Publishing", "Audio"],
      category: "text-to-speech",
      results: ["90% reduction in production costs", "8x faster time-to-market", "Expanded audiobook catalog by 300%"],
      challenge:
        "The consortium of publishers wanted to expand their audiobook offerings but faced prohibitive costs and lengthy production timelines using traditional voice actors and recording studios.",
      solution:
        "We developed a comprehensive platform that uses neural text-to-speech technology to convert manuscripts directly into professional-quality audiobooks, with tools for voice selection, pronunciation correction, and quality control.",
      technologies: ["Neural TTS", "Audio Processing", "Cloud Computing", "Web Application"],
      testimonial: {
        quote:
          "This platform has completely transformed our audiobook business. We've been able to convert our entire back catalog into audiobooks at a fraction of the traditional cost.",
        author: "Head of Digital Publishing",
        company: "Publishing House Consortium",
      },
    },
    {
      id: 3,
      title: "Traffic Monitoring System",
      description: "Real-time object detection for smart city traffic management.",
      fullDescription:
        "An intelligent traffic monitoring system that uses object detection to analyze traffic patterns, detect incidents, and optimize signal timing for improved urban mobility. The system processes video feeds from existing traffic cameras to count vehicles, measure speeds, detect accidents, and identify congestion patterns.\n\nThis data is used to dynamically adjust traffic signal timing, provide real-time updates to navigation systems, and alert emergency services to incidents. The system operates 24/7 in all weather conditions and has significantly improved traffic flow in the metropolitan area.",
      client: "Metropolitan Transportation Authority",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Object Detection", "Smart City", "Real-time"],
      category: "object-detection",
      results: [
        "25% reduction in average commute times",
        "40% decrease in traffic congestion",
        "Faster emergency response coordination",
      ],
      challenge:
        "The city was experiencing severe traffic congestion, inefficient signal timing, and delayed response to traffic incidents, resulting in frustrated commuters and economic losses.",
      solution:
        "We implemented an AI-powered traffic monitoring system that analyzes video feeds from existing traffic cameras to detect vehicles, measure traffic flow, identify incidents, and optimize signal timing in real-time.",
      technologies: ["Computer Vision", "Edge AI", "Real-time Analytics", "IoT Integration"],
      testimonial: {
        quote:
          "The impact on our city's traffic has been remarkable. Commuters are spending less time in traffic, and our emergency services can respond to incidents much more quickly.",
        author: "Traffic Operations Manager",
        company: "Metropolitan Transportation Authority",
      },
    },
    {
      id: 4,
      title: "Multilingual Customer Service Voice Bot",
      description: "Text-to-speech solution for automated customer service in multiple languages.",
      fullDescription:
        "An advanced voice bot system that provides natural-sounding customer service in 12 languages, handling common inquiries and seamlessly escalating to human agents when needed. The system combines natural language understanding with text-to-speech technology to create conversational interactions that feel natural and helpful.\n\nThe voice bot can handle reservation inquiries, provide property information, process simple requests, and connect guests with appropriate staff members when necessary. It operates across phone lines, website chat, and mobile app interfaces, providing consistent service across all channels.",
      client: "International Hotel Chain",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Text-to-Speech", "Customer Service", "Multilingual"],
      category: "text-to-speech",
      results: ["24/7 customer support coverage", "Support for 12 languages", "40% reduction in call center costs"],
      challenge:
        "The hotel chain needed to provide consistent, high-quality customer service across multiple languages and time zones without dramatically increasing staffing costs.",
      solution:
        "We created a multilingual voice bot that uses advanced text-to-speech technology to handle common customer inquiries in 12 languages, with natural-sounding voices and seamless handoff to human agents when needed.",
      technologies: ["Neural TTS", "Natural Language Processing", "Conversational AI", "Telephony Integration"],
      testimonial: {
        quote:
          "Our guests are often surprised to learn they've been speaking with an AI system. The voice quality and conversational ability are exceptional, and it's transformed our customer service operations.",
        author: "Global Customer Experience Director",
        company: "International Hotel Chain",
      },
    },
    {
      id: 5,
      title: "Manufacturing Quality Control",
      description: "Object detection system for identifying defects in production lines.",
      fullDescription:
        "A precision quality control system that uses object detection to identify manufacturing defects in real-time, improving product quality and reducing waste. The system uses high-speed cameras and specialized lighting to capture detailed images of products as they move through the production line.\n\nAdvanced AI models analyze these images to detect defects that would be difficult for human inspectors to consistently identify, such as microscopic cracks, color inconsistencies, and assembly errors. When defects are detected, the system can automatically reject the affected items and alert operators to potential issues in the production process.",
      client: "Automotive Parts Manufacturer",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Object Detection", "Manufacturing", "Quality Control"],
      category: "object-detection",
      results: [
        "99.8% defect detection rate",
        "75% reduction in quality control staff costs",
        "Decreased product returns by 45%",
      ],
      challenge:
        "The manufacturer was struggling with inconsistent quality control, resulting in defective products reaching customers, costly recalls, and damage to their reputation for reliability.",
      solution:
        "We developed an automated quality control system using high-speed cameras and AI-powered object detection to identify manufacturing defects in real-time with greater accuracy than human inspectors.",
      technologies: ["Computer Vision", "High-speed Imaging", "Deep Learning", "Production Line Integration"],
      testimonial: {
        quote:
          "The precision of this system has exceeded our expectations. We're catching defects that human inspectors would miss, and our quality metrics have never been better.",
        author: "Quality Assurance Director",
        company: "Automotive Parts Manufacturer",
      },
    },
    {
      id: 6,
      title: "Healthcare Records Integration",
      description: "Custom AI integration for medical records and diagnostic imaging.",
      fullDescription:
        "A seamless integration solution that connects electronic health records with AI-powered diagnostic tools, improving clinical decision-making and patient outcomes. The system creates a unified interface where healthcare providers can access patient records, lab results, and diagnostic images alongside AI-generated insights and recommendations.\n\nThe integration preserves all security and compliance requirements while enabling AI tools to analyze patient data and provide decision support to clinicians. This approach maintains human oversight while leveraging AI capabilities to identify patterns and correlations that might otherwise be missed.",
      client: "Regional Hospital Network",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Custom Integration", "Healthcare", "Diagnostics"],
      category: "custom-integration",
      results: [
        "35% faster diagnosis times",
        "Improved cross-department collaboration",
        "Comprehensive patient history access",
      ],
      challenge:
        "The hospital network had fragmented systems for patient records, diagnostic imaging, and lab results, making it difficult for healthcare providers to get a complete picture of patient health and slowing down diagnosis and treatment.",
      solution:
        "We created a secure integration platform that connects electronic health records with diagnostic systems and AI-powered analysis tools, providing clinicians with comprehensive patient information and AI-assisted insights in a single interface.",
      technologies: ["HIPAA-Compliant Cloud", "API Integration", "Medical Imaging Analysis", "Secure Data Exchange"],
      testimonial: {
        quote:
          "This integration has transformed how we deliver care. Our clinicians now have all the information they need in one place, with AI-powered insights that help them make better decisions faster.",
        author: "Chief Medical Information Officer",
        company: "Regional Hospital Network",
      },
    },
  ]

  const portfolioItem = portfolioItems.find((item) => item.id === id)

  if (!portfolioItem) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Portfolio Item Not Found</h1>
        <p className="text-muted-foreground mb-6">The portfolio item you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/portfolio" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("Back to Portfolio")}
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
              <Image
                src={portfolioItem.image || "/placeholder.svg"}
                alt={portfolioItem.title}
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{portfolioItem.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {portfolioItem.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg">{portfolioItem.fullDescription}</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Client</h3>
                  <p className="font-medium">{portfolioItem.client}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Category</h3>
                  <p className="font-medium capitalize">{portfolioItem.category.replace("-", " ")}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Technologies</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {portfolioItem.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {portfolioItem.results.map((result, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {portfolioItem.testimonial && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Testimonial</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    "{portfolioItem.testimonial.quote}"
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-medium">{portfolioItem.testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{portfolioItem.testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>The Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{portfolioItem.challenge}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{portfolioItem.solution}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">{t("Interested in a Similar Solution?")}</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t("Contact our team to discuss how we can create a custom AI solution tailored to your specific needs.")}
          </p>
          <Button asChild size="lg">
            <Link href="/contact">{t("Get in Touch")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

