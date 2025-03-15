"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, AlertCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    setStatus("loading")

    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      setMessage(t("Thank you for subscribing!"))
      setEmail("")
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder={t("Enter your email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="bg-background"
        />
      </div>
      <Button type="submit" className="w-full" disabled={status === "loading" || status === "success"}>
        {status === "loading" ? t("Subscribing...") : t("Subscribe")}
      </Button>

      {status === "success" && (
        <div className="flex items-center text-sm text-green-600 dark:text-green-400 mt-2">
          <Check className="h-4 w-4 mr-1" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center text-sm text-red-600 dark:text-red-400 mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{message}</span>
        </div>
      )}
    </form>
  )
}

