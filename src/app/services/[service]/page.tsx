"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, Mic, Cpu, Zap, HelpCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
// Fix the React.use() warning for params
import { use } from "react"

interface ServicePageProps {
  params: {
    service: string
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const { t } = useTranslation()
  const resolvedParams = use(params)
  const { service } = resolvedParams

  // Service data
  const services = {
    "object-detection": {
      title: "Object Detection Models",
      description:
        "Advanced AI models that can identify and track objects in images and video streams with high accuracy.",
      icon: Eye,
      heroImage: "/placeholder.svg?height=400&width=800",
      overview:
        "Our object detection technology uses state-of-the-art deep learning models to identify, classify, and track objects in images and video streams. These models are trained on vast datasets and can recognize thousands of different object types with exceptional accuracy, even in challenging conditions like poor lighting or partial occlusion.",
      features: [
        {
          title: "Real-time Processing",
          description:
            "Process video streams in real-time with minimal latency, enabling immediate response to detected objects.",
        },
        {
          title: "Multi-object Tracking",
          description:
            "Track multiple objects simultaneously across video frames, maintaining consistent identification.",
        },
        {
          title: "Custom Model Training",
          description: "Train models on your specific objects and environments for maximum accuracy in your use case.",
        },
        {
          title: "Edge Deployment",
          description:
            "Deploy models on edge devices for processing without internet connectivity or cloud dependencies.",
        },
      ],
      useCases: [
        {
          title: "MRI Brain Tumor Scans",
          description:
            "Automatically detect and classify brain tumors in MRI scans, assisting radiologists in diagnosis and treatment planning.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Security & Surveillance",
          description:
            "Detect unauthorized access, identify suspicious behavior, and enhance security monitoring capabilities.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Manufacturing QA",
          description:
            "Automatically inspect products for defects, ensure quality standards, and improve production efficiency.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Smart Cities",
          description:
            "Monitor traffic flow, optimize public transportation, and enhance urban planning with visual intelligence.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    "text-to-speech": {
      title: "Text-to-Speech Solutions",
      description: "Natural-sounding voice synthesis technology that converts written text into lifelike speech.",
      icon: Mic,
      heroImage: "/placeholder.svg?height=400&width=800",
      overview:
        "Our text-to-speech technology transforms written content into natural-sounding speech that's nearly indistinguishable from human voices. Using advanced neural networks, our models capture the nuances of human speech including intonation, rhythm, and emotional tone. This technology enables businesses to create more engaging and accessible content across multiple platforms and use cases.",
      features: [
        {
          title: "Natural Voice Synthesis",
          description: "Generate human-like speech with proper emphasis, intonation, and natural-sounding pauses.",
        },
        {
          title: "Multilingual Support",
          description: "Convert text to speech in over 30 languages and various regional accents.",
        },
        {
          title: "Voice Customization",
          description: "Adjust voice characteristics like pitch, speed, and tone to match your brand identity.",
        },
        {
          title: "Emotion Control",
          description:
            "Add emotional qualities to speech output, from excitement to empathy, for more engaging content.",
        },
        {
          title: "Batch Processing",
          description: "Convert large volumes of text efficiently for applications like audiobook production.",
        },
      ],
      useCases: [
        {
          title: "Audiobook Production",
          description:
            "Transform books into professional audiobooks with natural-sounding narration at a fraction of traditional costs.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Accessibility Solutions",
          description:
            "Make digital content accessible to visually impaired users and those with reading difficulties.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "E-Learning Platforms",
          description: "Create engaging educational content with voice narration that enhances learning experiences.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Customer Service",
          description: "Power interactive voice response systems and virtual assistants with natural-sounding voices.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    "custom-integration": {
      title: "Custom AI Integration",
      description: "Tailored AI solutions integrated seamlessly into your existing systems and workflows.",
      icon: Cpu,
      heroImage: "/placeholder.svg?height=400&width=800",
      overview:
        "Our custom AI integration services help businesses incorporate advanced artificial intelligence capabilities into their existing systems and workflows. We work closely with your team to understand your specific needs, then design and implement AI solutions that enhance your operations without disrupting your established processes. From initial assessment to deployment and ongoing support, we ensure a smooth transition to AI-enhanced capabilities.",
      features: [
        {
          title: "Needs Assessment",
          description:
            "Comprehensive analysis of your current systems and identification of optimal AI integration points.",
        },
        {
          title: "Custom API Development",
          description: "Build tailored APIs that connect our AI models with your existing software infrastructure.",
        },
        {
          title: "Legacy System Integration",
          description: "Specialized approaches to incorporate AI capabilities into older systems without replacement.",
        },
        {
          title: "Workflow Automation",
          description: "Identify and automate repetitive tasks using AI to improve efficiency and reduce errors.",
        },
        {
          title: "Continuous Improvement",
          description: "Ongoing monitoring and refinement of AI models based on real-world performance data.",
        },
      ],
      useCases: [
        {
          title: "Healthcare Systems",
          description:
            "Integrate AI diagnostic tools with existing electronic health record systems for improved patient care.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Financial Services",
          description: "Enhance fraud detection and risk assessment capabilities within established banking platforms.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Supply Chain Management",
          description: "Optimize inventory and logistics operations with predictive AI integrated into ERP systems.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Customer Relationship Management",
          description: "Add intelligent customer insights and predictive analytics to existing CRM platforms.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    "real-time-processing": {
      title: "Real-time Processing",
      description: "High-performance AI processing for time-sensitive applications with minimal latency.",
      icon: Zap,
      heroImage: "/placeholder.svg?height=400&width=800",
      overview:
        "Our real-time processing technology enables instantaneous AI analysis and decision-making for applications where timing is critical. Using optimized algorithms and specialized hardware configurations, we achieve processing speeds measured in milliseconds rather than seconds. This capability powers everything from financial trading systems to emergency response applications where delays can have significant consequences.",
      features: [
        {
          title: "Ultra-low Latency",
          description: "Process and respond to data in milliseconds for time-critical applications.",
        },
        {
          title: "Edge Computing",
          description: "Deploy processing capabilities directly on edge devices to eliminate network delays.",
        },
        {
          title: "Distributed Architecture",
          description: "Scale processing across multiple nodes for handling high-volume data streams.",
        },
        {
          title: "Fault Tolerance",
          description: "Built-in redundancy and failover mechanisms to ensure continuous operation.",
        },
        {
          title: "Adaptive Resource Allocation",
          description: "Dynamically adjust computing resources based on current processing demands.",
        },
      ],
      useCases: [
        {
          title: "Algorithmic Trading",
          description:
            "Execute financial transactions based on real-time market data analysis with microsecond precision.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Emergency Response",
          description:
            "Coordinate disaster response resources based on real-time analysis of incoming data from multiple sources.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Industrial Automation",
          description:
            "Control manufacturing processes with real-time quality inspection and immediate corrective actions.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Live Video Analysis",
          description:
            "Process video streams for security, sports analytics, or broadcast applications with frame-by-frame analysis.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
  }

  // Check if service exists
  if (!services[service as keyof typeof services]) {
    return notFound()
  }

  const serviceData = services[service as keyof typeof services]
  const ServiceIcon = serviceData.icon

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/services" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("Back to Services")}
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ServiceIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{serviceData.title}</h1>
          </div>

          <p className="text-xl text-muted-foreground mb-8">{serviceData.description}</p>

          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-12">
            <Image
              src={serviceData.heroImage || "/placeholder.svg"}
              alt={serviceData.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-16">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("Overview")}</h2>
            <p className="text-lg text-muted-foreground">{serviceData.overview}</p>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("Key Features")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceData.features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Use Cases Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("Use Cases")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serviceData.useCases.map((useCase, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={useCase.image || "/placeholder.svg"}
                      alt={useCase.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{useCase.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Button Section */}
          <section className="flex justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/faq">
                <HelpCircle className="h-5 w-5 mr-1" />
                {t("View Frequently Asked Questions")}
              </Link>
            </Button>
          </section>

          {/* CTA Section */}
          <section className="bg-muted p-8 rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("Ready to Get Started?")}</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                {t("Contact our team to discuss how our")} {serviceData.title}{" "}
                {t("can transform your business operations.")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">{t("Contact Us")}</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/demos">{t("Try Our Demos")}</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
