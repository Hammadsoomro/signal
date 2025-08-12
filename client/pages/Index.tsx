import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Phone,
  Users,
  Wallet,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  BarChart3,
  Lock,
  Clock,
  Sparkles,
  TrendingUp,
  Building,
  Award,
  Target,
  Briefcase,
  Headphones,
  PlayCircle,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Premium Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Premium Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Connectlify
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium px-3 py-1">
                Enterprise
              </Badge>
            </Link>

            {/* Premium Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </Link>
              <Link to="/enterprise" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Enterprise
              </Link>
              <Link to="/docs" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Docs
              </Link>
            </nav>

            {/* Premium Action Buttons */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="lg" className="text-slate-700 hover:text-blue-600 font-medium" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link to="/login">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Ultra Premium */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className={"absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2364748b\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"}></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Premium Content */}
            <div className="text-left max-w-2xl">
              <Badge 
                variant="outline" 
                className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 text-blue-700 px-4 py-2 text-sm font-medium"
              >
                <Award className="w-4 h-4 mr-2 text-blue-600" />
                #1 Enterprise SMS Platform
              </Badge>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Connect
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Globally
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-600 mb-10 leading-relaxed font-light">
                The world's most advanced SMS platform trusted by <span className="font-semibold text-blue-600">Fortune 500</span> companies. 
                Scale your communication with enterprise-grade security and international reach.
              </p>

              {/* Premium CTAs */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold"
                  asChild
                >
                  <Link to="/login">
                    Start Enterprise Trial
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold group"
                  asChild
                >
                  <Link to="/demo">
                    <PlayCircle className="mr-3 h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators - Premium */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">99.99% Uptime</span>
                  <span className="text-xs text-slate-500">SLA Guaranteed</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">SOC 2 Type II</span>
                  <span className="text-xs text-slate-500">Certified</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Global Reach</span>
                  <span className="text-xs text-slate-500">180+ Countries</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">24/7 Support</span>
                  <span className="text-xs text-slate-500">White Glove</span>
                </div>
              </div>
            </div>

            {/* Right Column - Premium Dashboard Preview */}
            <div className="relative">
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Live Dashboard</Badge>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Messages Sent</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">2.4M</div>
                      <div className="text-xs text-green-600 font-medium">+12% this month</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Delivery Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">99.8%</div>
                      <div className="text-xs text-green-600 font-medium">Industry leading</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Live Message Feed */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300 text-sm font-medium">Live Message Stream</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-600 text-white p-3 rounded-xl text-sm font-medium">
                      🌍 New message from +44 20 7946 0958
                    </div>
                    <div className="bg-slate-700 text-slate-300 p-3 rounded-xl text-sm">
                      "Thanks for the quick support! Your platform is amazing."
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Delivered globally • $0.005 • 847ms
                    </div>
                  </div>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-3 rounded-xl text-center border border-emerald-200/50">
                    <Globe className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-900">180+</div>
                    <div className="text-xs text-slate-600">Countries</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-3 rounded-xl text-center border border-blue-200/50">
                    <Building className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-900">50K+</div>
                    <div className="text-xs text-slate-600">Enterprises</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-xl text-center border border-purple-200/50">
                    <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-900">99.8%</div>
                    <div className="text-xs text-slate-600">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl shadow-xl animate-bounce">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-2xl shadow-xl animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                100B+
              </div>
              <div className="text-slate-600 font-medium">Messages Delivered</div>
              <div className="text-sm text-slate-400">Globally Trusted</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Fortune 500
              </div>
              <div className="text-slate-600 font-medium">Enterprise Clients</div>
              <div className="text-sm text-slate-400">Industry Leaders</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                99.99%
              </div>
              <div className="text-slate-600 font-medium">Uptime SLA</div>
              <div className="text-sm text-slate-400">Mission Critical</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                180+
              </div>
              <div className="text-slate-600 font-medium">Countries Covered</div>
              <div className="text-sm text-slate-400">Global Reach</div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-blue-100 text-blue-700 px-4 py-2">Enterprise Features</Badge>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Built for Global Scale
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Everything you need to manage enterprise-grade SMS communication across continents, 
              with military-grade security and white-glove support.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4">
                  Real-time Global Messaging
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  Instant SMS delivery to 180+ countries with sub-second latency. 
                  Advanced routing algorithms ensure 99.8% delivery rates worldwide.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Sub-second global delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Smart routing optimization</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Real-time delivery tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4">
                  Enterprise Security
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  SOC 2 Type II certified with end-to-end encryption, GDPR compliance, 
                  and comprehensive audit trails for enterprise peace of mind.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>SOC 2 Type II Certified</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>GDPR & HIPAA compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4">
                  Advanced Analytics
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  Real-time insights with AI-powered analytics, delivery optimization, 
                  and comprehensive reporting for data-driven decision making.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>AI-powered insights</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Custom dashboards</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Automated reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white px-10 py-6 text-lg font-semibold shadow-xl"
              asChild
            >
              <Link to="/features">
                Explore All Features
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-purple-100 text-purple-700 px-4 py-2">Customer Success</Badge>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how global enterprises are transforming their communication with Connectlify
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700 ml-2">5.0 Rating</span>
                </div>
                <blockquote className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">
                  "Connectlify transformed our global customer support. The enterprise-grade security 
                  and 99.99% uptime gave us the confidence to scale internationally."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">SM</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">Sarah Mitchell</div>
                    <div className="text-slate-600">CTO, TechGlobal Inc.</div>
                    <div className="text-sm text-blue-600 font-medium">Fortune 100 Company</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700 ml-2">5.0 Rating</span>
                </div>
                <blockquote className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">
                  "The AI-powered analytics and global reach capabilities are unmatched. 
                  We've seen 40% improvement in customer engagement across all markets."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">DK</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">David Kim</div>
                    <div className="text-slate-600">VP Marketing, Enterprise Solutions</div>
                    <div className="text-sm text-emerald-600 font-medium">Global Enterprise</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700 ml-2">5.0 Rating</span>
                </div>
                <blockquote className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">
                  "SOC 2 Type II certification and GDPR compliance made this an easy choice. 
                  The white-glove support is exactly what our enterprise needed."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">EJ</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">Emily Johnson</div>
                    <div className="text-slate-600">Chief Security Officer</div>
                    <div className="text-sm text-purple-600 font-medium">Financial Services</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <Badge className="mb-8 bg-white/10 text-white border-white/20 px-6 py-3 text-lg">
            Ready to Scale Globally?
          </Badge>
          
          <h2 className="text-6xl font-bold text-white mb-8 leading-tight">
            Join the Enterprise
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Communication Revolution
            </span>
          </h2>
          
          <p className="text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with millions of customers globally through the most advanced SMS platform. 
            Enterprise-grade security, 99.99% uptime, and white-glove support included.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-gray-100 text-xl px-12 py-8 shadow-2xl font-bold"
              asChild
            >
              <Link to="/login">
                Start Enterprise Trial
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 text-xl px-12 py-8 font-bold"
              asChild
            >
              <Link to="/contact">
                <Briefcase className="mr-3 h-6 w-6" />
                Contact Sales
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <div className="text-white font-semibold text-lg mb-2">Setup in Minutes</div>
              <div className="text-blue-200">Enterprise deployment ready</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-white font-semibold text-lg mb-2">Bank-Grade Security</div>
              <div className="text-blue-200">SOC 2 Type II certified</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Headphones className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-white font-semibold text-lg mb-2">White-Glove Support</div>
              <div className="text-blue-200">24/7 dedicated team</div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Connectlify</span>
                <Badge className="bg-blue-600 text-white">Enterprise</Badge>
              </div>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                The world's most advanced SMS platform trusted by Fortune 500 companies. 
                Connect globally with enterprise-grade security and reliability.
              </p>
              <div className="flex items-center gap-6">
                <Badge className="bg-green-100 text-green-700">SOC 2 Type II</Badge>
                <Badge className="bg-blue-100 text-blue-700">GDPR Compliant</Badge>
                <Badge className="bg-purple-100 text-purple-700">ISO 27001</Badge>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Enterprise Platform</h3>
              <ul className="space-y-4">
                <li><Link to="/features" className="hover:text-white transition-colors text-lg">Global Messaging</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors text-lg">Enterprise Security</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors text-lg">Advanced Analytics</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors text-lg">Developer API</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors text-lg">Integrations</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Solutions</h3>
              <ul className="space-y-4">
                <li><Link to="/enterprise" className="hover:text-white transition-colors text-lg">Enterprise</Link></li>
                <li><Link to="/healthcare" className="hover:text-white transition-colors text-lg">Healthcare</Link></li>
                <li><Link to="/financial" className="hover:text-white transition-colors text-lg">Financial Services</Link></li>
                <li><Link to="/retail" className="hover:text-white transition-colors text-lg">Retail & E-commerce</Link></li>
                <li><Link to="/government" className="hover:text-white transition-colors text-lg">Government</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Enterprise Support</h3>
              <ul className="space-y-4">
                <li><Link to="/support" className="hover:text-white transition-colors text-lg">24/7 Support</Link></li>
                <li><Link to="/docs" className="hover:text-white transition-colors text-lg">Documentation</Link></li>
                <li><Link to="/status" className="hover:text-white transition-colors text-lg">System Status</Link></li>
                <li><Link to="/compliance" className="hover:text-white transition-colors text-lg">Compliance Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors text-lg">Contact Sales</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-400 text-lg">
                © 2024 Connectlify Enterprise. All rights reserved. SOC 2 Type II Certified.
              </p>
              <div className="flex items-center gap-8">
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/security" className="text-slate-400 hover:text-white transition-colors">Security</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
