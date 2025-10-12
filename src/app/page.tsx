import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/custom/logo'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Users, CheckCircle2, Clock, ArrowRight, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto" />
            <div className="bg-gradient-to-r from-[#24c0b7] to-[#1a8a83] bg-clip-text text-2xl font-bold text-transparent italic">
              Campus Voice
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="hidden text-sm font-medium md:inline-flex">
              <Link href="/admin">Login</Link>
            </Button>
            <Button
              asChild
              className="border border-gray-900 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              <Link href="/student">Open an account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#24c0b7] via-[#20ada4] to-[#1a8a83] py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 bg-white text-base text-[#1a8a83]">
              Your Campus Communication Hub
            </Badge>
            <h1 className="mb-6 text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
              Complaint management made easy for students and staff.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-teal-50 lg:text-xl">
              Campus Voice helps you submit and track complaints faster with dedicated tracking dashboard and real-time
              notification system.
            </p>
            <Button
              asChild
              size="lg"
              className="mb-16 bg-white px-8 py-6 text-base font-semibold text-gray-900 hover:bg-gray-50"
            >
              <Link href="/student">Get Started</Link>
            </Button>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-5xl">
              <div className="overflow-hidden rounded-xl border-4 border-white/20 shadow-2xl">
                <Image
                  src="/images/mockup.png"
                  alt="Campus Voice Dashboard Preview"
                  width={1920}
                  height={1080}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#24c0b7]/10">
                <MessageSquare className="size-8 text-[#24c0b7]" />
              </div>
              <div className="mb-2 text-4xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Complaints Submitted</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#24c0b7]/10">
                <CheckCircle2 className="size-8 text-[#24c0b7]" />
              </div>
              <div className="mb-2 text-4xl font-bold text-gray-900">89%</div>
              <div className="text-sm text-gray-600">Resolution Rate</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#24c0b7]/10">
                <Users className="size-8 text-[#24c0b7]" />
              </div>
              <div className="mb-2 text-4xl font-bold text-gray-900">1,200+</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Campus Voice?</h2>
            <p className="text-lg text-gray-600">
              Our platform is designed to make complaint management transparent, efficient, and student-friendly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <MessageSquare className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle className="text-gray-900">Easy Submission</CardTitle>
                <CardDescription className="text-gray-600">
                  Submit complaints quickly with our intuitive form. Choose from predefined categories and provide
                  detailed descriptions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Clock className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle className="text-gray-900">Real-time Tracking</CardTitle>
                <CardDescription className="text-gray-600">
                  Track the status of your complaints in real-time. Get updates when your complaint moves through
                  different stages.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Shield className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle className="text-gray-900">Transparent Process</CardTitle>
                <CardDescription className="text-gray-600">
                  Full transparency in the complaint resolution process. See who&apos;s handling your case and expected
                  timelines.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <CheckCircle2 className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle className="text-gray-900">Quick Resolution</CardTitle>
                <CardDescription className="text-gray-600">
                  Our admin team works efficiently to resolve complaints. Most issues are addressed within 48-72 hours.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Users className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle className="text-gray-900">Student-Centered</CardTitle>
                <CardDescription className="text-gray-600">
                  Built with students in mind. Simple interface, clear communication, and focus on student satisfaction.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#24c0b7]/10 transition-colors group-hover:bg-[#24c0b7]/20">
                  <Zap className="size-6 text-[#24c0b7]" />
                </div>
                <CardTitle className="text-gray-900">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-600">
                  View comprehensive analytics about complaint trends, resolution times, and overall campus
                  satisfaction.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#24c0b7] via-[#20ada4] to-[#1a8a83] py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ready to Make Your Voice Heard?</h2>
            <p className="mb-8 text-lg text-teal-50">
              Join thousands of students who are already using Campus Voice to create positive change in their academic
              environment.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white px-8 py-6 text-base font-semibold text-gray-900 hover:bg-gray-50"
            >
              <Link href="/student">
                Get Started Now
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <Logo className="h-8 w-auto" />
              <div className="text-sm text-gray-600">
                © 2025 Campus Voice. Making education better, one complaint at a time.
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/student" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
                Student Portal
              </Link>
              <Link href="/admin" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
