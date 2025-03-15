"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, RefreshCw } from "lucide-react"

export default function ObjectDetectionDemo() {
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detections, setDetections] = useState<
    Array<{
      label: string
      confidence: number
      bbox: [number, number, number, number]
    }>
  >([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setDetections([])
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setDetections([])
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const processImage = () => {
    if (!image) return

    setIsProcessing(true)

    // Simulate AI processing with random detections
    setTimeout(() => {
      const mockDetections = [
        {
          label: "Person",
          confidence: 0.98,
          bbox: [50, 50, 200, 350] as [number, number, number, number],
        },
        {
          label: "Car",
          confidence: 0.92,
          bbox: [300, 200, 250, 150] as [number, number, number, number],
        },
        {
          label: "Dog",
          confidence: 0.87,
          bbox: [150, 320, 100, 80] as [number, number, number, number],
        },
      ]

      setDetections(mockDetections)
      setIsProcessing(false)
    }, 2000)
  }

  const resetDemo = () => {
    setImage(null)
    setDetections([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  useEffect(() => {
    if (!image || !canvasRef.current || detections.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw the image
      ctx.drawImage(img, 0, 0)

      // Draw bounding boxes
      detections.forEach((detection) => {
        const [x, y, width, height] = detection.bbox

        // Draw rectangle
        ctx.strokeStyle = "#10b981"
        ctx.lineWidth = 3
        ctx.strokeRect(x, y, width, height)

        // Draw label background
        ctx.fillStyle = "#10b981"
        const textWidth = ctx.measureText(detection.label).width
        ctx.fillRect(x, y - 25, textWidth + 10, 25)

        // Draw label text
        ctx.fillStyle = "white"
        ctx.font = "16px sans-serif"
        ctx.fillText(detection.label, x + 5, y - 7)
      })
    }
  }, [image, detections])

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Object Detection Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image to see our AI model detect and identify objects in real-time.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload an Image</CardTitle>
            <CardDescription>Drag and drop an image or click to browse your files.</CardDescription>
          </CardHeader>
          <CardContent>
            {!image ? (
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Drag and drop an image here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse your files</p>
                  <Button variant="outline">Select Image</Button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative max-h-[500px] overflow-auto border rounded-lg">
                  <canvas ref={canvasRef} className="max-w-full" />
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={processImage} disabled={isProcessing} className="gap-2">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" />
                        Detect Objects
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetDemo}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {detections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detection Results</CardTitle>
              <CardDescription>Objects detected in the image with confidence scores.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {detections.map((detection, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="font-medium">{detection.label}</div>
                    <div className="text-sm text-muted-foreground">
                      Confidence: {(detection.confidence * 100).toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

