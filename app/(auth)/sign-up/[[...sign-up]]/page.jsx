import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Shield, TrendingUp, Brain, Users, Award } from "lucide-react";
 
export default function Page() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Side - Branding */}
        <section className="relative flex flex-col justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 lg:col-span-5 lg:h-full xl:col-span-6">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-8 lg:p-12 text-white">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-xl blur opacity-75"></div>
                <div className="relative bg-white p-3 rounded-xl">
                  <Image src="/chart-donut.svg" alt="FinTrack Logo" width={32} height={32} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">FinTrack</span>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
            </Link>

            {/* Hero Content */}
            <div className="max-w-lg">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Start Your
                <span className="block text-yellow-300">Financial Journey</span>
              </h1>
              
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Join our community of smart savers and take the first step towards financial freedom with AI-powered insights.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">10K+</div>
                  <div className="text-purple-200 text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">$2M+</div>
                  <div className="text-purple-200 text-sm">Money Saved</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-yellow-300" />
                  </div>
                  <span className="text-purple-100">Join a community of smart savers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-300" />
                  </div>
                  <span className="text-purple-100">Get personalized achievements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-yellow-300" />
                  </div>
                  <span className="text-purple-100">AI learns your spending habits</span>
                </div>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute bottom-0 right-0 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200" className="text-white">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="200" height="200" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </section>

        {/* Right Side - Sign Up Form */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-white p-3 rounded-xl shadow-lg">
                    <Image src="/chart-donut.svg" alt="FinTrack Logo" width={32} height={32} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    FinTrack
                  </span>
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
              </Link>
            </div>

            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Start your journey to financial freedom today</p>
            </div>

            {/* Clerk Sign Up Component */}
            <div className="flex justify-center">
              <SignUp 
                appearance={{
                  elements: {
                    formButtonPrimary: 
                      "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                    card: "shadow-2xl border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                  },
                }}
              />
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}