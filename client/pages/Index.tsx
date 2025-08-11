import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Phone, 
  Users, 
  Wallet, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Connectlify</span>
            </Link>

            {/* Login/Signup Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/login">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge variant="outline" className="mb-6 bg-white/10 border-white/20 text-white backdrop-blur">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-300" />
                Next-Generation SMS Platform
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Connect. Communicate.
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Succeed.</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                Send, receive, and manage SMS conversations at scale with our enterprise-grade platform.
                Buy numbers worldwide, create sub-accounts for your team, and track everything with real-time
                messaging powered by SignalWire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-4 shadow-xl" asChild>
                  <Link to="/login">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 backdrop-blur" asChild>
                  <Link to="/conversations">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    View Demo
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Lightning Fast</span>
                </div>
              </div>
            </div>

            {/* Right side - Interactive Demo */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-2 text-gray-400 text-sm">Connectlify Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-600 text-white p-3 rounded-lg text-sm">
                      📱 New SMS from +1 (555) 123-4567
                    </div>
                    <div className="bg-gray-700 text-gray-300 p-3 rounded-lg text-sm">
                      "Thanks for the quick response! When can we schedule a call?"
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Message delivered • $0.01
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-500/20 p-3 rounded-lg text-center">
                    <Phone className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-white text-sm font-medium">15</div>
                    <div className="text-blue-200 text-xs">Numbers</div>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg text-center">
                    <Users className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <div className="text-white text-sm font-medium">3</div>
                    <div className="text-purple-200 text-xs">Sub-accounts</div>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg text-center">
                    <Wallet className="w-6 h-6 text-green-400 mx-auto mb-1" />
                    <div className="text-white text-sm font-medium">$125</div>
                    <div className="text-green-200 text-xs">Balance</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-full shadow-lg animate-pulse">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-full shadow-lg animate-bounce">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-gray-600">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Everything you need for SMS management</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From individual conversations to enterprise team management, we provide a complete SMS platform
            designed for businesses of all sizes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Real-time Conversations</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Instant SMS messaging with SignalWire integration, unread counters, contact management,
                and automated sorting by latest activity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Global Phone Numbers</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Purchase and manage phone numbers from US, Canada, UK, and Australia.
                Switch between numbers seamlessly for different campaigns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Team Management</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Create up to 3 sub-accounts with individual wallets, number assignments, and granular
                permissions for seamless team collaboration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Wallet className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Smart Wallet System</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Secure wallet with Safepay integration, real-time balance tracking, automatic deductions,
                and detailed transaction history
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Enterprise Security</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Advanced security with API key management, webhook endpoints, 2FA, IP whitelisting,
                and comprehensive audit trails
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Lightning Fast Delivery</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                High-performance messaging infrastructure with real-time delivery status,
                instant notifications, and 99.9% uptime guarantee
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why teams choose Connectlify</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Multi-number Management</h3>
                    <p className="text-muted-foreground">Handle multiple phone numbers from a single dashboard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Team Collaboration</h3>
                    <p className="text-muted-foreground">Share wallet balance and manage permissions for sub-accounts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Real-time Messaging</h3>
                    <p className="text-muted-foreground">Instant SMS delivery with read receipts and typing indicators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Smart Notifications</h3>
                    <p className="text-muted-foreground">Never miss a message with our intelligent notification system</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <Card className="bg-background/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                  <CardTitle className="text-lg">Trusted by thousands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "Connectlify has transformed how we handle customer communications. 
                    The multi-number system and sub-account management are game-changers."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">JS</span>
                    </div>
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">Marketing Director</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using Connectlify to manage their SMS communications
          </p>
          <Button size="lg" asChild>
            <Link to="/login">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Connectlify</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Connectlify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
