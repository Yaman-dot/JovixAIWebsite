"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Mic, Cpu, Zap } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  service: string
  icon: React.ElementType
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>([])

  // All FAQs from all services
  const allFAQs: FAQ[] = [
    // Object Detection FAQs
    {
      id: "od-1",
      question: "How accurate are your object detection models?",
      answer:
        "Our models achieve 95-99% accuracy depending on the specific use case and environmental conditions. We continuously train and refine our models to improve performance.",
      category: "accuracy",
      service: "object-detection",
      icon: Eye,
    },
    {
      id: "od-2",
      question: "Can your models work with existing camera systems?",
      answer:
        "Yes, our solutions are designed to integrate with most standard camera systems and video feeds, requiring minimal hardware changes.",
      category: "compatibility",
      service: "object-detection",
      icon: Eye,
    },
    {
      id: "od-3",
      question: "How long does it take to train a custom model?",
      answer:
        "Training time varies based on complexity, but typically ranges from 2-4 weeks from data collection to deployment-ready models.",
      category: "implementation",
      service: "object-detection",
      icon: Eye,
    },
    {
      id: "od-4",
      question: "Do you support on-premises deployment?",
      answer:
        "Yes, we offer both cloud-based and on-premises deployment options to meet various security and compliance requirements.",
      category: "deployment",
      service: "object-detection",
      icon: Eye,
    },
    {
      id: "od-5",
      question: "What types of objects can your models detect?",
      answer:
        "Our models can detect virtually any visible object with proper training. Standard models recognize thousands of common objects, while custom models can be trained for specific items like medical anomalies, industrial parts, or unique products.",
      category: "capabilities",
      service: "object-detection",
      icon: Eye,
    },
    {
      id: "od-6",
      question: "How do your models perform in low-light conditions?",
      answer:
        "Our advanced models are trained on diverse lighting conditions and can perform well in low-light scenarios. For extremely dark environments, we recommend infrared or thermal camera integration for optimal results.",
      category: "performance",
      service: "object-detection",
      icon: Eye,
    },

    // Text-to-Speech FAQs
    {
      id: "tts-1",
      question: "How natural do the voices sound?",
      answer:
        "Our latest models score over 4.5/5 in blind listening tests comparing them to human voices, making them among the most natural-sounding in the industry.",
      category: "quality",
      service: "text-to-speech",
      icon: Mic,
    },
    {
      id: "tts-2",
      question: "What languages do you support?",
      answer:
        "We currently support over 30 languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and many more.",
      category: "capabilities",
      service: "text-to-speech",
      icon: Mic,
    },
    {
      id: "tts-3",
      question: "Can I create a custom voice that sounds like a specific person?",
      answer:
        "Yes, with proper permissions and sufficient voice samples, we can create custom voice models that mimic specific voice characteristics.",
      category: "customization",
      service: "text-to-speech",
      icon: Mic,
    },
    {
      id: "tts-4",
      question: "How do you handle technical terminology or unusual words?",
      answer:
        "Our models include specialized dictionaries for various fields, and we offer custom pronunciation guides for industry-specific terminology.",
      category: "capabilities",
      service: "text-to-speech",
      icon: Mic,
    },
    {
      id: "tts-5",
      question: "What file formats do you support for output?",
      answer:
        "We support all major audio formats including MP3, WAV, OGG, FLAC, and more. We can also provide streaming audio for real-time applications.",
      category: "technical",
      service: "text-to-speech",
      icon: Mic,
    },
    {
      id: "tts-6",
      question: "Can your system handle real-time text-to-speech conversion?",
      answer:
        "Yes, our system is optimized for low-latency processing and can convert text to speech in real-time for applications like virtual assistants, live presentations, and interactive systems.",
      category: "performance",
      service: "text-to-speech",
      icon: Mic,
    },

    // Custom Integration FAQs
    {
      id: "ci-1",
      question: "How long does a typical integration project take?",
      answer:
        "Project timelines vary based on complexity, but most integrations are completed within 3-6 months from initial assessment to full deployment.",
      category: "implementation",
      service: "custom-integration",
      icon: Cpu,
    },
    {
      id: "ci-2",
      question: "Will integration disrupt our current operations?",
      answer:
        "We use a phased implementation approach designed to minimize disruption, often running systems in parallel until the new capabilities are fully tested.",
      category: "implementation",
      service: "custom-integration",
      icon: Cpu,
    },
    {
      id: "ci-3",
      question: "Do you provide training for our team?",
      answer:
        "Yes, comprehensive training is included in all integration projects to ensure your team can effectively use and maintain the new AI capabilities.",
      category: "support",
      service: "custom-integration",
      icon: Cpu,
    },
    {
      id: "ci-4",
      question: "What ongoing support do you provide after integration?",
      answer:
        "We offer various support tiers including regular maintenance, performance monitoring, model updates, and 24/7 technical assistance.",
      category: "support",
      service: "custom-integration",
      icon: Cpu,
    },
    {
      id: "ci-5",
      question: "Can you integrate with legacy systems?",
      answer:
        "Yes, we specialize in connecting modern AI capabilities with legacy systems through custom APIs, middleware solutions, and specialized connectors designed for older technologies.",
      category: "compatibility",
      service: "custom-integration",
      icon: Cpu,
    },
    {
      id: "ci-6",
      question: "What security measures are implemented during integration?",
      answer:
        "We follow industry best practices for security including data encryption, secure API endpoints, authentication protocols, and compliance with regulations like GDPR, HIPAA, and others relevant to your industry.",
      category: "security",
      service: "custom-integration",
      icon: Cpu,
    },

    // Real-time Processing FAQs
    {
      id: "rtp-1",
      question: "What kind of latency can we expect?",
      answer:
        "Our systems typically achieve end-to-end processing latencies of 10-50 milliseconds depending on the complexity of the analysis required.",
      category: "performance",
      service: "real-time-processing",
      icon: Zap,
    },
    {
      id: "rtp-2",
      question: "How do you handle network interruptions?",
      answer:
        "Our edge computing capabilities allow for continued local processing during network outages, with data synchronization once connectivity is restored.",
      category: "reliability",
      service: "real-time-processing",
      icon: Zap,
    },
    {
      id: "rtp-3",
      question: "What hardware requirements are needed?",
      answer:
        "Requirements vary by application, but we can deploy on everything from specialized GPU clusters to optimized edge devices depending on your needs.",
      category: "technical",
      service: "real-time-processing",
      icon: Zap,
    },
    {
      id: "rtp-4",
      question: "Can your system scale to handle traffic spikes?",
      answer:
        "Yes, our distributed architecture allows for dynamic scaling to handle sudden increases in processing demand without performance degradation.",
      category: "scalability",
      service: "real-time-processing",
      icon: Zap,
    },
    {
      id: "rtp-5",
      question: "How do you ensure high availability for critical applications?",
      answer:
        "We implement redundant systems, automatic failover mechanisms, load balancing, and geographic distribution to ensure 99.99% uptime for mission-critical applications.",
      category: "reliability",
      service: "real-time-processing",
      icon: Zap,
    },
    {
      id: "rtp-6",
      question: "Can real-time processing be integrated with existing alerting systems?",
      answer:
        "Yes, our systems can trigger alerts through various channels including email, SMS, push notifications, and direct integration with incident management platforms like PagerDuty, OpsGenie, and custom solutions.",
      category: "integration",
      service: "real-time-processing",
      icon: Zap,
    },
  ]

  // Get unique categories
  const categories = ["all", ...new Set(allFAQs.map((faq) => faq.category))]

  // Filter FAQs based on search query and selected category
  useEffect(() => {
    let filtered = allFAQs

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

    setFilteredFAQs(filtered)
  }, [searchQuery, selectedCategory])

  // Group FAQs by service
  const objectDetectionFAQs = filteredFAQs.filter((faq) => faq.service === "object-detection")
  const textToSpeechFAQs = filteredFAQs.filter((faq) => faq.service === "text-to-speech")
  const customIntegrationFAQs = filteredFAQs.filter((faq) => faq.service === "custom-integration")
  const realTimeProcessingFAQs = filteredFAQs.filter((faq) => faq.service === "real-time-processing")

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our AI services and solutions.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {searchQuery || selectedCategory !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="sm:w-auto"
              >
                Clear Filters
              </Button>
            ) : null}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredFAQs.length} of {allFAQs.length} questions
        </div>

        {/* FAQ Tabs */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="object-detection" className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Object Detection
            </TabsTrigger>
            <TabsTrigger value="text-to-speech" className="flex items-center gap-2">
              <Mic className="h-4 w-4" /> Text-to-Speech
            </TabsTrigger>
            <TabsTrigger value="custom-integration" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" /> Custom Integration
            </TabsTrigger>
            <TabsTrigger value="real-time-processing" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Real-time Processing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg p-2">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start text-left">
                        <div className="mr-3 mt-1">
                          <faq.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-sm text-muted-foreground">
                            {faq.service
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-10">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No matching questions found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="object-detection">
            {objectDetectionFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {objectDetectionFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg p-2">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start text-left">
                        <div className="mr-3 mt-1">
                          <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-sm text-muted-foreground">Object Detection</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-10">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No matching questions found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="text-to-speech">
            {textToSpeechFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {textToSpeechFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg p-2">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start text-left">
                        <div className="mr-3 mt-1">
                          <Mic className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-sm text-muted-foreground">Text-to-Speech</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-10">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No matching questions found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom-integration">
            {customIntegrationFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {customIntegrationFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg p-2">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start text-left">
                        <div className="mr-3 mt-1">
                          <Cpu className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-sm text-muted-foreground">Custom Integration</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-10">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No matching questions found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="real-time-processing">
            {realTimeProcessingFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {realTimeProcessingFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg p-2">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start text-left">
                        <div className="mr-3 mt-1">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-sm text-muted-foreground">Real-time Processing</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-10">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No matching questions found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
