"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Github, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import { loginAction, registerAction, githubAuthAction } from "@/lib/actions/auth-actions"

export default function AuthPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

  // Sign In form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  // Handle GitHub OAuth callback
  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      toast({
        title: t("GitHub Authentication Failed"),
        description: searchParams.get("error_description") || t("An error occurred during GitHub authentication"),
        variant: "destructive",
      })
      return
    }

    if (code) {
      const handleGitHubCallback = async () => {
        setIsLoading(true)
        try {
          const result = await githubAuthAction(code)

          if (result.success) {
            toast({
              title: t("GitHub Authentication Successful"),
              description: t("Welcome to JovixAI!"),
            })
            router.push("/")
          } else {
            toast({
              title: t("GitHub Authentication Failed"),
              description: result.error || t("Failed to authenticate with GitHub"),
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("GitHub callback error:", error)
          toast({
            title: t("Authentication Error"),
            description: t("An unexpected error occurred"),
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      handleGitHubCallback()
    }
  }, [searchParams, toast, router, t])

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check")
        const data = await response.json()

        if (data.authenticated) {
          router.push("/")
        }
      } catch (error) {
        console.error("Auth check error:", error)
      }
    }

    checkAuth()
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get user agent for activity logging
      const userAgent = navigator.userAgent

      // Create form data
      const formData = new FormData()
      formData.append("email", signInData.email)
      formData.append("password", signInData.password)
      formData.append("rememberMe", signInData.rememberMe ? "on" : "off")
      formData.append("userAgent", userAgent)

      // Call server action
      const result = await loginAction(formData)

      if (result.success) {
        toast({
          title: t("Sign in successful"),
          description: t("Welcome back to JovixAI!"),
        })
        router.push("/")
      } else {
        toast({
          title: t("Sign in failed"),
          description: result.error || t("Invalid credentials"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: t("Sign in failed"),
        description: t("An unexpected error occurred"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: t("Passwords don't match"),
        description: t("Please make sure your passwords match."),
        variant: "destructive",
      })
      return
    }

    if (!signUpData.agreeTerms) {
      toast({
        title: t("Terms agreement required"),
        description: t("Please agree to the terms and conditions."),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get user agent for activity logging
      const userAgent = navigator.userAgent

      // Create form data
      const formData = new FormData()
      formData.append("name", signUpData.name)
      formData.append("email", signUpData.email)
      formData.append("password", signUpData.password)
      formData.append("confirmPassword", signUpData.confirmPassword)
      formData.append("agreeTerms", signUpData.agreeTerms ? "on" : "off")
      formData.append("userAgent", userAgent)

      // Call server action
      const result = await registerAction(formData)

      if (result.success) {
        toast({
          title: t("Account created successfully"),
          description: t("Welcome to JovixAI!"),
        })
        router.push("/")
      } else {
        toast({
          title: t("Registration failed"),
          description: result.error || t("Failed to create account"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: t("Registration failed"),
        description: t("An unexpected error occurred"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubAuth = () => {
    setIsLoading(true)

    // Redirect to GitHub OAuth
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth`
    const scope = "user:email"

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === "signin" ? t("Sign in to your account") : t("Create an account")}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "signin"
                ? t("Enter your credentials to access your account")
                : t("Fill in the form below to create your account")}
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t("Sign In")}</TabsTrigger>
                <TabsTrigger value="signup">{t("Sign Up")}</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              {/* Sign In Form */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t("Email")}</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">{t("Password")}</Label>
                      <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                        {t("Forgot password?")}
                      </Link>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={signInData.rememberMe}
                      onCheckedChange={(checked) => setSignInData({ ...signInData, rememberMe: checked as boolean })}
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("Remember me")}
                    </label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("Signing in...")}
                      </>
                    ) : (
                      t("Sign In")
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("Full Name")}</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("Email")}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t("Password")}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("Confirm Password")}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signUpData.agreeTerms}
                      onCheckedChange={(checked) => setSignUpData({ ...signUpData, agreeTerms: checked as boolean })}
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("I agree to the")}{" "}
                      <Link href="/terms" className="text-primary hover:underline ml-1">
                        {t("terms and conditions")}
                      </Link>
                    </label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("Creating account...")}
                      </>
                    ) : (
                      t("Create Account")
                    )}
                  </Button>
                </form>
              </TabsContent>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">{t("Or continue with")}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={handleGithubAuth} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Github className="mr-2 h-4 w-4" />
                    )}
                    GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col items-center p-6 pt-0">
            <p className="text-center text-sm text-muted-foreground mt-2">
              {activeTab === "signin" ? (
                <>
                  {t("Don't have an account?")}
                  <button className="text-primary hover:underline ml-1" onClick={() => setActiveTab("signup")}>
                    {t("Sign up")}
                  </button>
                </>
              ) : (
                <>
                  {t("Already have an account?")}
                  <button className="text-primary hover:underline ml-1" onClick={() => setActiveTab("signin")}>
                    {t("Sign in")}
                  </button>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

