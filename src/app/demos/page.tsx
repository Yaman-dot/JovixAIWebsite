"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Mic } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function DemosPage() {
  const { t } = useTranslation()

  const demos = [
    {
      id: "object-detection",
      title: t("Object Detection Demo"),
      description: t("Upload an image and watch our AI identify objects in real-time."),
      icon: Eye,
      features: [
        "Real-time object identification",
        "Multiple object detection",
        "Confidence scoring",
        "Bounding box visualization",
        "Support for various image formats",
      ],
    },
    {
      id: "text-to-speech",
      title: t("Text-to-Speech Demo"),
      description: t("Convert your text into natural-sounding speech with our advanced AI models."),
      icon: Mic,
      features: [
        "Natural voice synthesis",
        "Multiple voice options",
        "Adjustable speech rate",
        "Emotion and tone control",
        "Support for multiple languages",
      ],
    },
  ]

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("Interactive AI Demos")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("Experience the power of our AI technologies firsthand with these interactive demonstrations.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {demos.map((demo) => {
            const DemoIcon = demo.icon

            return (
              <Card key={demo.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <DemoIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{demo.title}</CardTitle>
                  <CardDescription className="text-base">{demo.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h3 className="font-medium mb-2">{t("Features")}:</h3>
                  <ul className="space-y-2">
                    {demo.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/demos/${demo.id}`}>{t("Try Demo")}</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t("Want to see more?")}</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t(
                "These demos showcase just a fraction of our AI capabilities. Contact us to arrange a personalized demonstration tailored to your specific business needs.",
              )}
            </p>
            <Button asChild size="lg">
              <Link href="/contact">{t("Request Custom Demo")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

