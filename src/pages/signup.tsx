import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-[#0084ca] font-bold text-3xl">ETN</h1>
            <p className="text-sm text-gray-600 mt-1">Ethiopian Talent Network</p>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              Log in to ETN
            </h2>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Continue with LinkedIn
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#000">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Continue with Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-12 border-gray-300"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-12 border-gray-300"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#0084ca] focus:ring-[#0084ca] border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Keep me logged in
                </label>
              </div>
              <button type="button" className="text-sm text-[#0084ca] hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#0084ca] hover:bg-[#006ba6] text-white font-medium rounded-full"
            >
              Log in
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an ETN account?{" "}
              <Link to="/signup" className="text-[#0084ca] hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0084ca] to-[#006ba6] items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Find great talent
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Work with the largest network of independent professionals and get things done—from quick turnarounds to big transformations.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg">Proof of quality with every talent profile</p>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg">Safe and secure payments</p>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg">24/7 support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
