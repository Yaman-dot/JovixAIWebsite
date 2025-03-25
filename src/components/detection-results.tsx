import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Detection {
  label: string
  confidence: number
  bbox: [number, number, number, number]
}

interface DetectionResultsProps {
  detections: Detection[]
}

export default function DetectionResults({ detections }: DetectionResultsProps) {
  // Sort detections by confidence (highest first)
  const sortedDetections = [...detections].sort((a, b) => b.confidence - a.confidence)

  return (
    <Card className="bg-background border-2 border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Detection Results</span>
          <Badge variant="outline" className="ml-2">
            {detections.length} objects found
          </Badge>
        </CardTitle>
        <CardDescription>Objects detected in the image with confidence scores from YOLO model.</CardDescription>
      </CardHeader>
      <CardContent>
        {detections.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No objects detected. Try another image or a different model.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDetections.map((detection, index) => (
              <div key={index} className="space-y-2 p-3 rounded-md border bg-muted/20">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-lg">{detection.label}</div>
                  <div className="text-sm font-medium">Confidence: {detection.confidence.toFixed(2)}%</div>
                </div>
                <Progress
                  value={detection.confidence}
                  className="h-2"
                  // Color based on confidence level
                  style={
                    {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      "--progress-color":
                        detection.confidence > 90
                          ? "var(--green-500)"
                          : detection.confidence > 70
                            ? "var(--amber-500)"
                            : "var(--red-500)",
                    } as React.CSSProperties
                  }
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Bounding box: [{detection.bbox.map((v) => Math.round(v)).join(", ")}]
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

