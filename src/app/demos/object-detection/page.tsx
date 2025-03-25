"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, RefreshCw, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DetectionResults from "@/components/detection-results"
import { Badge } from "@/components/ui/badge"

interface Model {
  description: string
  current: boolean
}

interface ModelResponse {
  models: Record<string, Model>
  current_model: string
}

export default function ObjectDetectionDemo() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [detections, setDetections] = useState<
    Array<{
      label: string
      confidence: number
      bbox: [number, number, number, number]
    }>
  >([])
  const [models, setModels] = useState<Record<string, Model>>({})
  const [currentModel, setCurrentModel] = useState<string>("")
  const [isSwitchingModel, setIsSwitchingModel] = useState(false)
  // Add a status indicator to show backend connection status
  // Add this state at the top with other state variables
  const [backendStatus, setBackendStatus] = useState<"connecting" | "connected" | "error">("connecting")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add this useEffect to check backend connection
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000/test")
        if (response.ok) {
          setBackendStatus("connected")

          // Also fetch models if connection is successful
          const modelsResponse = await fetch("http://localhost:5000/models")
          if (modelsResponse.ok) {
            const data: ModelResponse = await modelsResponse.json()
            setModels(data.models)
            setCurrentModel(data.current_model)
          }
        } else {
          setBackendStatus("error")
        }
      } catch (error) {
        console.error("Error connecting to backend:", error)
        setBackendStatus("error")
      } finally {
        setIsLoading(false)
      }
    }

    checkBackendConnection()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setProcessedImage(null)
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
      setProcessedImage(null)
      setDetections([])
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleModelChange = async (modelKey: string) => {
    if (modelKey === currentModel) return

    setIsSwitchingModel(true)

    try {
      const response = await fetch("http://localhost:5000/models/switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: modelKey }),
      })

      if (!response.ok) {
        throw new Error(`Failed to switch model: ${response.statusText}`)
      }

      const data = await response.json()

      // Update current model
      setCurrentModel(data.current_model)

      // Update models object to reflect the change
      setModels((prev) => {
        const updated = { ...prev }

        // Set all models to not current
        Object.keys(updated).forEach((key) => {
          updated[key] = { ...updated[key], current: false }
        })

        // Set the new current model
        if (updated[data.current_model]) {
          updated[data.current_model] = { ...updated[data.current_model], current: true }
        }

        return updated
      })

      // Clear any existing results
      setProcessedImage(null)
      setDetections([])
    } catch (error) {
      console.error("Error switching model:", error)
    } finally {
      setIsSwitchingModel(false)
    }
  }

  const processImage = async () => {
    if (!image) return
    setIsProcessing(true)
    setDetections([])
    setProcessedImage(null)

    try {
      // Convert data URL to File object
      const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(",")
        const mime = arr[0].match(/:(.*?);/)?.[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      }

      const file = dataURLtoFile(image, "image.jpg")
      const formData = new FormData()
      formData.append("file", file)

      console.log("Sending image to backend for YOLO processing...")
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Received detection results from backend:", result)

      // Set the processed image URL
      if (result.full_url) {
        setProcessedImage(result.full_url)
      }

      // Set detections from YOLO model
      if (result.detections && Array.isArray(result.detections)) {
        setDetections(result.detections)
        console.log(`Received ${result.detections.length} detections from YOLO model`)
      } else {
        console.warn("No detections received from backend")
        setDetections([])
      }
    } catch (error) {
      console.error("Error processing image with YOLO:", error)
      alert("Error connecting to YOLO backend. Please check if the server is running.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetDemo = () => {
    setImage(null)
    setProcessedImage(null)
    setDetections([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Object Detection Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image to see our AI model detect and identify objects in real-time.
          </p>
        </div>

        {/* Add this component at the top of the return statement, right after the title section */}
        <div className="mb-4">
          <Card
            className={`${
              backendStatus === "connected"
                ? "bg-green-500/10"
                : backendStatus === "error"
                  ? "bg-red-500/10"
                  : "bg-amber-500/10"
            }`}
          >
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                {backendStatus === "connecting" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {backendStatus === "connected" && <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />}
                {backendStatus === "error" && <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />}
                <span>
                  {backendStatus === "connected" && "Connected to YOLO backend"}
                  {backendStatus === "connecting" && "Connecting to YOLO backend..."}
                  {backendStatus === "error" && "Error connecting to YOLO backend"}
                </span>
              </div>

              {backendStatus === "error" && (
                <div className="text-sm text-muted-foreground">
                  Make sure the Python backend server is running on http://localhost:5000
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Model Selector */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>AI Model Selection</span>
              {currentModel && (
                <Badge className="ml-2" variant="outline">
                  Current: {currentModel}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Choose which YOLO model to use for object detection</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading available models from backend...</span>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Select
                  value={currentModel}
                  onValueChange={handleModelChange}
                  disabled={isSwitchingModel || isProcessing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a YOLO model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(models).map(([key, model]) => (
                      <SelectItem key={key} value={key}>
                        {key} - {model.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isSwitchingModel && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Switching YOLO model...</span>
                  </div>
                )}

                <div className="text-sm text-muted-foreground mt-2">
                  <p>The selected model will be used for all object detection operations.</p>
                  <p className="mt-1">Different models offer varying trade-offs between speed and accuracy.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Image */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Original Image</h3>
                    <div className="relative border rounded-lg overflow-hidden h-[300px]">
                      <img src={image || "/placeholder.svg"} alt="Original" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Processed Image */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Processed Image</h3>
                    <div className="relative border rounded-lg overflow-hidden h-[300px] bg-muted/30">
                      {processedImage ? (
                        <img
                          src={processedImage || "/placeholder.svg"}
                          alt="Processed"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          {isProcessing ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-8 w-8 animate-spin mb-2" />
                              <span>Processing image...</span>
                            </div>
                          ) : (
                            <span>Process the image to see results</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={processImage} disabled={isProcessing || isSwitchingModel} className="gap-2">
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
                  <Button variant="outline" onClick={resetDemo} disabled={isProcessing}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detection Results */}
        {detections.length > 0 && <DetectionResults detections={detections} />}
      </div>
    </div>
  )
}

