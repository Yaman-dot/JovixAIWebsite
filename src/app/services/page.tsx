"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Mic, Cpu, Zap, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function ServicesPage() {
  const { t } = useTranslation()

  const services = [
    {
      id: "object-detection",
      title: t("Object Detection Models"),
      description: t(
        "Advanced AI models that can identify and track objects in images and video streams with high accuracy.",
      ),
      icon: Eye,
      features: [
        "Real-time object detection and tracking",
        "Multi-object classification",
        "Spatial relationship analysis",
        "Custom model training for specific use cases",
        "Integration with existing camera systems",
      ],
      useCases: [
        "Retail inventory management",
        "Security and surveillance",
        "Autonomous vehicles",
        "Manufacturing quality control",
        "Smart city applications",
      ],
    },
    {
      id: "text-to-speech",
      title: t("Text-to-Speech Solutions"),
      description: t("Natural-sounding voice synthesis technology that converts written text into lifelike speech."),
      icon: Mic,
      features: [
        "Human-like voice synthesis",
        "Multiple languages and accents",
        "Customizable voice characteristics",
        "Emotion and tone control",
        "Real-time processing capabilities",
      ],
      useCases: [
        "Audiobook production",
        "Virtual assistants",
        "Accessibility solutions",
        "E-learning platforms",
        "Customer service automation",
      ],
    },
    {
      id: "custom-integration",
      title: t("Custom AI Integration"),
      description: t("Tailored AI solutions integrated seamlessly into your existing systems and workflows."),
      icon: Cpu,
      features: [
        "Custom API development",
        "Legacy system integration",
        "Workflow automation",
        "Scalable cloud deployment",
        "Continuous model improvement",
      ],
      useCases: [
        "Enterprise resource planning",
        "Customer relationship management",
        "Supply chain optimization",
        "Healthcare information systems",
        "Financial services automation",
      ],
    },
    {
      id: "real-time-processing",
      title: t("Real-time Processing"),
      description: t("High-performance AI processing for time-sensitive applications with minimal latency."),
      icon: Zap,
      features: [
        "Edge computing capabilities",
        "Low-latency processing",
        "High throughput data handling",
        "Distributed computing architecture",
        "Fault-tolerant systems",
      ],
      useCases: [
        "Live video analysis",
        "Financial trading systems",
        "IoT sensor networks",
        "Real-time recommendation engines",
        "Emergency response systems",
      ],
    },
  ]

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("Our AI Services")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("Cutting-edge AI solutions designed to transform your business operations and customer experiences.")}
          </p>
        </div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {React.createElement(service.icon, { className: "h-8 w-8 text-primary" })}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
                  <Button asChild>
                    <Link href={`/services/${service.id}`} className="gap-2">
                      {t("Learn more")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("Key Features")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("Use Cases")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.useCases.map((useCase, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

