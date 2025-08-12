"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const { data: session, isPending } = useSession()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              CodeClone
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {session ? (
                <Button asChild>
                  <Link href="/problems">Go to Problems</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 New: AI-powered hints available
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master Coding
            <span className="text-primary block">One Problem at a Time</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Practice coding problems, improve your skills, and prepare for technical interviews with our comprehensive
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Button size="lg" asChild>
                <Link href="/problems">Continue Coding</Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Coding Free</Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link href="/problems">Browse Problems</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CodeClone?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to become a better programmer and ace your technical interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Code className="w-10 h-10 text-primary mb-2" />
                <CardTitle>1000+ Problems</CardTitle>
                <CardDescription>Curated coding problems from easy to hard difficulty levels</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Real-time Testing</CardTitle>
                <CardDescription>Run and test your code instantly with our online compiler</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>Monitor your improvement with detailed analytics and stats</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Community</CardTitle>
                <CardDescription>Join discussions and learn from other developers</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers who are improving their skills with CodeClone.
          </p>
          {!session && (
            <Button size="lg" asChild>
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CodeClone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
