import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/custom/logo'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Users, CheckCircle2, Clock, ArrowRight, Shield, Zap, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-background/80 border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo className="h-8 w-auto" />
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/admin">Admin Portal</Link>
            </Button>
            <Button asChild className="bg-[#24c0b7] hover:bg-[#24c0b7]/90">
              <Link href="/student">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
              <Heart className="mr-2 size-4 text-[#24c0b7]" />
              Your Voice Matters
            </Badge>
            <h1 className="text-foreground mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Campus <span className="text-[#24c0b7]">Voice</span>
            </h1>
            <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
              A modern, transparent platform for students to submit complaints, track their progress, and create
              positive change in their academic environment.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-[#24c0b7] px-8 py-6 text-lg hover:bg-[#24c0b7]/90">
                <Link href="/student">
                  Submit a Complaint
                  <MessageSquare className="ml-2 size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card className="border-[#24c0b7]/20 text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#24c0b7]/10">
                  <MessageSquare className="size-6 text-[#24c0b7]" />
                </div>
                <div className="text-foreground text-3xl font-bold">500+</div>
                <div className="text-muted-foreground text-sm">Complaints Submitted</div>
              </CardContent>
            </Card>
            <Card className="border-[#24c0b7]/20 text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#24c0b7]/10">
                  <CheckCircle2 className="size-6 text-[#24c0b7]" />
                </div>
                <div className="text-foreground text-3xl font-bold">89%</div>
                <div className="text-muted-foreground text-sm">Resolution Rate</div>
              </CardContent>
            </Card>
            <Card className="border-[#24c0b7]/20 text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#24c0b7]/10">
                  <Users className="size-6 text-[#24c0b7]" />
                </div>
                <div className="text-foreground text-3xl font-bold">1,200+</div>
                <div className="text-muted-foreground text-sm">Active Students</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Why Choose Campus Voice?</h2>
            <p className="text-muted-foreground text-lg">
              Our platform is designed to make complaint management transparent, efficient, and student-friendly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-[#24c0b7]/20 transition-all duration-300 hover:border-[#24c0b7]/40 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <MessageSquare className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle>Easy Submission</CardTitle>
                <CardDescription>
                  Submit complaints quickly with our intuitive form. Choose from predefined categories and provide
                  detailed descriptions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-[#24c0b7]/20 transition-all duration-300 hover:border-[#24c0b7]/40 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Clock className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Track the status of your complaints in real-time. Get updates when your complaint moves through
                  different stages.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-[#24c0b7]/20 transition-all duration-300 hover:border-[#24c0b7]/40 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Shield className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle>Transparent Process</CardTitle>
                <CardDescription>
                  Full transparency in the complaint resolution process. See who&apos;s handling your case and expected
                  timelines.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-[#24c0b7]/20 transition-all duration-300 hover:border-[#24c0b7]/40 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <CheckCircle2 className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle>Quick Resolution</CardTitle>
                <CardDescription>
                  Our admin team works efficiently to resolve complaints. Most issues are addressed within 48-72 hours.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-[#24c0b7]/20 transition-all duration-300 hover:border-[#24c0b7]/40 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Users className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle>Student-Centered</CardTitle>
                <CardDescription>
                  Built with students in mind. Simple interface, clear communication, and focus on student satisfaction.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-[#24c0b7]/20 transition-all duration-300 hover:border-[#24c0b7]/40 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Zap className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View comprehensive analytics about complaint trends, resolution times, and overall campus
                  satisfaction.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#24c0b7]/5 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Ready to Make Your Voice Heard?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of students who are already using Campus Voice to create positive change in their academic
              environment.
            </p>
            <Button asChild size="lg" className="bg-[#24c0b7] px-8 py-6 text-lg hover:bg-[#24c0b7]/90">
              <Link href="/student">
                Get Started Now
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/80 border-t py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <Logo className="h-8 w-auto" />
              <div className="text-muted-foreground text-sm">
                © 2024 Campus Voice. Making education better, one complaint at a time.
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/student" className="text-muted-foreground text-sm transition-colors hover:text-[#24c0b7]">
                Student Portal
              </Link>
              <Link href="/admin" className="text-muted-foreground text-sm transition-colors hover:text-[#24c0b7]">
                Admin Portal
              </Link>
              <Link
                href="/(landing)/about"
                className="text-muted-foreground text-sm transition-colors hover:text-[#24c0b7]"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
