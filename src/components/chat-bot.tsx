"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatBot() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant. How can I help you with our AI services today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare the conversation history for the AI
      const conversationHistory = messages
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      const prompt = `${conversationHistory}\nUser: ${input}\nAssistant:`

      // Generate response using AI SDK
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: prompt,
        system:
          "You are a helpful AI assistant for AI Vision, a company specializing in object detection and text-to-speech AI solutions. Provide concise, helpful responses about our services, technology, and how we can help customers. Keep responses under 150 words.",
      })

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: text,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <Button onClick={toggleChat} className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50" size="icon">
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] md:w-[400px] z-50"
          >
            <Card className="shadow-xl border-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5 text-primary" />
                  {t("AI Assistant")}
                </CardTitle>
              </CardHeader>

              <ScrollArea className="h-[350px] px-4">
                <div className="space-y-4 pt-1 pb-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-muted"}`}>
                          <AvatarFallback>
                            {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 bg-muted">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t("Thinking...")}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <CardFooter className="pt-3">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("Type your message...")}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

