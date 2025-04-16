"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, RefreshCw, Play, Pause } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SpeechToSpeechDemo() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [volume, setVolume] = useState(80)
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; audio?: string }>>([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false, audio: "" },
  ])
  const [isPlaying, setIsPlaying] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  // Simulate receiving a response from the AI
  const simulateAIResponse = () => {
    setIsProcessing(true)

    // Sample responses
    const responses = [
      "I understand. Could you tell me more about what you're looking for?",
      "That's interesting! I can definitely help you with that.",
      "I'm analyzing that information now. Let me provide some insights.",
      "Great question! Here's what I know about that topic.",
      "I'd be happy to assist with that request. Let me work on it for you.",
    ]

    // Randomly select a response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    // Simulate processing delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: randomResponse,
          isUser: false,
          audio: "",
        },
      ])
      setIsProcessing(false)

      // Simulate speech synthesis
      const utterance = new SpeechSynthesisUtterance(randomResponse)
      if (!isMuted) {
        window.speechSynthesis.speak(utterance)
      }
    }, 1500)
  }

  const handleStartCall = () => {
    setIsCallActive(true)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    window.speechSynthesis.cancel()
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      window.speechSynthesis.cancel()
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)

    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false)

      // Add user message
      const userMessages = [
        "Can you tell me more about your speech-to-speech technology?",
        "How does your AI voice synthesis work?",
        "What languages do you support for speech recognition?",
        "Can I use this for my business applications?",
        "Tell me about the accuracy of your speech recognition.",
      ]

      const randomUserMessage = userMessages[Math.floor(Math.random() * userMessages.length)]

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: randomUserMessage,
          isUser: true,
        },
      ])

      // Trigger AI response
      simulateAIResponse()
    }, 3000)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  const handlePlayAudio = (id: number) => {
    setIsPlaying(id)

    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(null)
    }, 2000)
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Speech-to-Speech Conversation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a natural voice conversation with our AI assistant using our advanced speech-to-speech technology.
          </p>
        </div>

        <Tabs defaultValue="call" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="call">Voice Call</TabsTrigger>
            <TabsTrigger value="about">About the Technology</TabsTrigger>
          </TabsList>

          <TabsContent value="call">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>AI Voice Assistant</CardTitle>
                      <CardDescription>
                        {isCallActive ? (
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Call active
                          </span>
                        ) : (
                          "Start a voice call"
                        )}
                      </CardDescription>
                    </div>
                  </div>

                  <div>
                    {isCallActive ? (
                      <Button variant="destructive" size="icon" onClick={handleEndCall}>
                        <PhoneOff className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button variant="default" size="icon" onClick={handleStartCall}>
                        <Phone className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Conversation Area */}
                <div className="border rounded-lg h-[400px] bg-muted/30 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p>{message.text}</p>
                            {!message.isUser && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-7 px-2"
                                onClick={() => handlePlayAudio(message.id)}
                              >
                                {isPlaying === message.id ? (
                                  <>
                                    <Pause className="h-3 w-3 mr-1" />
                                    Playing...
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 mr-1" />
                                    Play Audio
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                            <div className="flex items-center gap-2">
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>AI is responding...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Call Controls */}
                  <div className="p-4 border-t bg-background">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 w-1/3">
                        <Button
                          variant={isMuted ? "destructive" : "outline"}
                          size="icon"
                          onClick={handleToggleMute}
                          disabled={!isCallActive}
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <Slider
                          value={[volume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleVolumeChange}
                          disabled={!isCallActive || isMuted}
                          className="w-full"
                        />
                      </div>

                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        className={`rounded-full h-16 w-16 ${isRecording ? "animate-pulse" : ""}`}
                        onClick={handleStartRecording}
                        disabled={!isCallActive || isRecording || isProcessing}
                      >
                        {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      </Button>

                      <div className="w-1/3"></div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {isCallActive ? (
                    <p>Click and hold the microphone button to speak to the AI assistant.</p>
                  ) : (
                    <p>Press the phone button to start a voice call with the AI assistant.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Speech-to-Speech Technology</CardTitle>
                <CardDescription>Learn how our advanced AI-powered speech-to-speech system works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How It Works</h3>
                  <p className="text-muted-foreground">
                    Our speech-to-speech technology combines advanced speech recognition, natural language processing,
                    and voice synthesis to enable natural conversations with AI. The system processes your spoken words
                    in real-time, understands the context and intent, generates an appropriate response, and delivers it
                    using a natural-sounding voice.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Real-time speech recognition with 98% accuracy</li>
                    <li>Natural language understanding with contextual awareness</li>
                    <li>Human-like voice synthesis with emotional expression</li>
                    <li>Support for 30+ languages and regional accents</li>
                    <li>Low latency processing for natural conversation flow</li>
                    <li>Voice customization options for brand consistency</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Applications</h3>
                  <p className="text-muted-foreground">
                    Our speech-to-speech technology powers a wide range of applications including virtual assistants,
                    customer service automation, accessibility tools, language translation services, educational
                    platforms, and interactive voice response systems. The technology can be customized and integrated
                    into existing systems through our API.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacy & Security</h3>
                  <p className="text-muted-foreground">
                    We prioritize user privacy and data security. All voice data is processed with strict privacy
                    controls, and we offer on-premises deployment options for organizations with sensitive data
                    requirements. Our systems comply with GDPR, HIPAA, and other relevant regulations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
