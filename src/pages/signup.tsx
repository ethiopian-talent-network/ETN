import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"employer" | "talent">("talent");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    console.log("Signup:", {
      firstName,
      email,
      password,
      confirmPassword,
      userType,
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-[#0084ca] font-bold text-3xl">ETN</h1>
            <p className="text-sm text-gray-600 mt-1">
              Ethiopian Talent Network
            </p>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              Sign up to find work you love
            </h2>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("talent")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  userType === "talent"
                    ? "border-[#0084ca] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-gray-900">I'm a talents</div>
                <div className="text-sm text-gray-600 mt-1">
                  Looking for work
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUserType("employer")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  userType === "employer"
                    ? "border-[#0084ca] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-gray-900">I'm a employer</div>
                <div className="text-sm text-gray-600 mt-1">
                  Hiring for a project
                </div>
              </button>
            </div>
          </div>

          {/* Social Sign Up Buttons */}
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1.5 h-12 border-gray-300"
                  placeholder="Name"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
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
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password (8 or more characters)
              </Label>
              <Input
                id="password"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-12 border-gray-300"
                placeholder="Password"
                minLength={8}
                required
              />
            </div>

            <div>
              <Label
                htmlFor="country"
                className="text-sm font-medium text-gray-700"
              >
                confirm your Password
              </Label>
              <Input
                id="passwordConfirm"
                type="password"
                autoComplete="current-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5 h-12 border-gray-300"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="flex items-start pt-2">
              <input
                id="updates"
                type="checkbox"
                className="h-4 w-4 text-[#0084ca] focus:ring-[#0084ca] border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="updates" className="ml-2 text-sm text-gray-600">
                Send me helpful emails to find rewarding work and job leads
              </label>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-[#0084ca] focus:ring-[#0084ca] border-gray-300 rounded mt-0.5"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Yes, I understand and agree to the{" "}
                <button
                  type="button"
                  className="text-[#0084ca] hover:underline"
                >
                  ETN Terms of Service
                </button>
                , including the{" "}
                <button
                  type="button"
                  className="text-[#0084ca] hover:underline"
                >
                  User Agreement
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-[#0084ca] hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#0084ca] hover:bg-[#006ba6] text-white font-medium rounded-full"
            >
              Create my account
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#0084ca] hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0084ca] to-[#006ba6] items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Join the Ethiopian's work marketplace
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Find great talent. Build your business. Take your career to the next
            level.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold mb-1">5M+</div>
              <div className="text-sm text-white/80">Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">$3.8B+</div>
              <div className="text-sm text-white/80">Paid out</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">$1B+</div>
              <div className="text-sm text-white/80">In earnings</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 mr-3 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg">Post a job and hire top talent</p>
            </div>
            <div className="flex items-start">
              <svg
                className="w-6 h-6 mr-3 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg">
                Find opportunities for every stage of your freelance career
              </p>
            </div>
            <div className="flex items-start">
              <svg
                className="w-6 h-6 mr-3 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg">Control when, where, and how you work</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
