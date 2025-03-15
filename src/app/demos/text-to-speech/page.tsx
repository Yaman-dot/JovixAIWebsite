"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RefreshCw, Volume2 } from "lucide-react"

const VOICES = [
  { id: "en-US-1", name: "Emma (Female)", language: "English (US)" },
  { id: "en-US-2", name: "James (Male)", language: "English (US)" },
  { id: "en-GB-1", name: "Sophie (Female)", language: "English (UK)" },
  { id: "ar-1", name: "Amir (Male)", language: "Arabic" },
]

export default function TextToSpeechDemo() {
  const [text, setText] = useState(
    "Welcome to our AI-powered text-to-speech demo. This technology converts written text into natural-sounding speech that closely resembles human voices.",
  )
  const [voice, setVoice] = useState(VOICES[0].id)
  const [speed, setSpeed] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // Reset audio when text changes
    if (audioUrl) {
      setAudioUrl(null)
      setIsPlaying(false)
    }
  }

  const handleVoiceChange = (value: string) => {
    setVoice(value)
    // Reset audio when voice changes
    if (audioUrl) {
      setAudioUrl(null)
      setIsPlaying(false)
    }
  }

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0])
    // Update playback rate if audio is loaded
    if (audioRef.current) {
      audioRef.current.playbackRate = value[0]
    }
  }

  const generateSpeech = () => {
    if (!text.trim()) return

    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      // In a real implementation, this would be an API call to a TTS service
      // For demo purposes, we're using the browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text)
      const voices = window.speechSynthesis.getVoices()

      // Set voice (this is a mock implementation)
      utterance.voice = voices[0]
      utterance.rate = speed

      // Create a blob URL for the audio (in a real app, this would be from the API response)
      const audioBlob = new Blob([""], { type: "audio/mp3" })
      const url = URL.createObjectURL(audioBlob)

      setAudioUrl(url)
      setIsProcessing(false)

      // Use the Web Speech API for the demo
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)

      utterance.onend = () => {
        setIsPlaying(false)
      }
    }, 1500)
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      } else {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = speed
        window.speechSynthesis.speak(utterance)

        utterance.onend = () => {
          setIsPlaying(false)
        }
      }
      setIsPlaying(true)
    }
  }

  const resetDemo = () => {
    setText(
      "Welcome to our AI-powered text-to-speech demo. This technology converts written text into natural-sounding speech that closely resembles human voices.",
    )
    setVoice(VOICES[0].id)
    setSpeed(1)
    setAudioUrl(null)
    setIsPlaying(false)
    window.speechSynthesis.cancel()
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Text-to-Speech Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter text and hear it converted to natural-sounding speech using our advanced AI models.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Your Text</CardTitle>
            <CardDescription>Type or paste the text you want to convert to speech.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text to convert to speech..."
              className="min-h-[150px] mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice</label>
                <Select value={voice} onValueChange={handleVoiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} - {v.language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Speed</label>
                  <span className="text-sm text-muted-foreground">{speed}x</span>
                </div>
                <Slider value={[speed]} min={0.5} max={2} step={0.1} onValueChange={handleSpeedChange} />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={generateSpeech} disabled={isProcessing || !text.trim()} className="gap-2">
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Generate Speech
                  </>
                )}
              </Button>

              {audioUrl && (
                <Button variant="outline" onClick={togglePlayPause} className="gap-2">
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
              )}

              <Button variant="outline" onClick={resetDemo}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Our Text-to-Speech Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our advanced AI-powered text-to-speech technology uses deep learning models to generate natural-sounding
              speech from text input. The system has been trained on thousands of hours of human speech to accurately
              capture intonation, rhythm, and pronunciation patterns.
            </p>
            <p className="text-muted-foreground">Key features include:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
              <li>Multiple voice options across different languages and accents</li>
              <li>Adjustable speech rate and pitch</li>
              <li>Natural-sounding pronunciation with proper emphasis</li>
              <li>Support for special characters, numbers, and abbreviations</li>
              <li>Low latency for real-time applications</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

