import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  Code,
  Palette,
  TrendingUp,
  Users,
  Scale,
  GraduationCap,
  Wrench,
  DollarSign,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { ImageWithFallback } from "../components/imagesWith/ImageWithFallback";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userMode, setUserMode] = useState<"hire" | "work">("hire");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { icon: Code, title: "Development & IT", color: "text-[#0084ca]" },
    { icon: Palette, title: "Design & Creative", color: "text-[#0084ca]" },
    { icon: TrendingUp, title: "Sales & Marketing", color: "text-[#0084ca]" },
    { icon: Users, title: "Admin & Support", color: "text-[#0084ca]" },
    { icon: DollarSign, title: "Finance & Accounting", color: "text-[#0084ca]" },
    { icon: Scale, title: "Legal", color: "text-[#0084ca]" },
    { icon: GraduationCap, title: "HR & Training", color: "text-[#0084ca]" },
    { icon: Wrench, title: "Engineering & Architecture", color: "text-[#0084ca]" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#0084ca]">ETN</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-700 hover:text-gray-900 text-sm flex items-center">
                Find Talent
              </button>
              <button className="text-gray-700 hover:text-gray-900 text-sm flex items-center">
                Find Work
              </button>
              <button className="text-gray-700 hover:text-gray-900 text-sm flex items-center">
                Why ETN
              </button>
              <Link to="/login" className="text-gray-700 hover:text-gray-900 text-sm">
                Log in
              </Link>
              <Link to="/signup">
                <Button className="bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-full">
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <button className="block w-full text-left text-gray-700 hover:text-gray-900 py-2">
                Find Talent
              </button>
              <button className="block w-full text-left text-gray-700 hover:text-gray-900 py-2">
                Find Work
              </button>
              <button className="block w-full text-left text-gray-700 hover:text-gray-900 py-2">
                Why ETN
              </button>
              <Link to="/login" className="block text-gray-700 hover:text-gray-900 py-2">
                Log in
              </Link>
              <Link to="/signup" className="block">
                <Button className="w-full bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-full">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Banner */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Connect with Ethiopia's top talent. Start hiring today.
            </p>
            <button className="text-sm text-[#0084ca] hover:underline flex items-center">
              Get started <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Hire the experts your business needs
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Access skilled Ethiopian freelancers ready to help you build and scale
                — without the full-time commitment
              </p>

              {/* Toggle */}
              <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200 mb-6">
                <button
                  onClick={() => setUserMode("hire")}
                  className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                    userMode === "hire"
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  I want to hire
                </button>
                <button
                  onClick={() => setUserMode("work")}
                  className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                    userMode === "work"
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  I want to work
                </button>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe what you need to hire for..."
                    className="flex-1 h-14 px-6 text-base border-gray-300 rounded-full"
                  />
                  <Button
                    type="submit"
                    className="h-14 px-8 bg-gray-900 hover:bg-gray-800 text-white rounded-full"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Popular:</span>
                {["Web design", "AI development", "Video editing", "SEO"].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:border-gray-400 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1642522029686-5485ea7e6042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1lZXRpbmclMjBvZmZpY2V8ZW58MXx8fHwxNzc2MjE5MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Professional meeting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wide">
            Trusted by leading Ethiopian companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {["Company A", "Company B", "Company C", "Company D", "Company E"].map((company) => (
              <div key={company} className="text-gray-600 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Find freelancers for every type of work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:border-[#0084ca] transition-all text-left group"
                >
                  <Icon className={`w-8 h-8 mb-3 ${category.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="font-medium text-gray-900">{category.title}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">How it works</h2>
            <div className="flex gap-3">
              <button className="px-6 py-2 border-2 border-gray-900 rounded-full font-medium">
                For hiring
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:border-gray-400">
                For finding work
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-br from-yellow-100 to-green-100 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">ETN</div>
                  <p className="text-sm text-gray-700">Get started</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Posting jobs is always free
                </h3>
                <p className="text-gray-600">
                  Create your job post and start receiving proposals from qualified freelancers
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758876020337-2501eeb1ede5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdvbWFuJTIwZW50cmVwcmVuZXVyJTIwd29ya2luZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzYzMzg3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Freelancer working"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Get proposals and hire
                </h3>
                <p className="text-gray-600">
                  Review proposals, interview favorites, and hire the best fit for your project
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1738566495427-bb6427cfbab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjB2aWRlbyUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzc2MzM4NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Professional working"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pay when work is done
                </h3>
                <p className="text-gray-600">
                  Only pay for work you approve. Our secure payment system protects you every step
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0084ca] to-[#006ba6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Find freelancers who can help you build what's next
          </h2>
          <Link to="/signup">
            <Button className="bg-white text-[#0084ca] hover:bg-gray-100 px-8 h-12 rounded-full font-medium mt-6">
              Explore freelancers
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* For Clients */}
            <div>
              <h3 className="text-white font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">How to hire</button></li>
                <li><button className="hover:text-white">Talent Marketplace</button></li>
                <li><button className="hover:text-white">Project Catalog</button></li>
                <li><button className="hover:text-white">Enterprise</button></li>
                <li><button className="hover:text-white">Any Hire</button></li>
              </ul>
            </div>

            {/* For Talent */}
            <div>
              <h3 className="text-white font-semibold mb-4">For Talent</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">How to find work</button></li>
                <li><button className="hover:text-white">Direct Contracts</button></li>
                <li><button className="hover:text-white">Find freelance jobs</button></li>
                <li><button className="hover:text-white">Find local jobs</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">Help & support</button></li>
                <li><button className="hover:text-white">Success stories</button></li>
                <li><button className="hover:text-white">Reviews</button></li>
                <li><button className="hover:text-white">Resources</button></li>
                <li><button className="hover:text-white">Blog</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">About us</button></li>
                <li><button className="hover:text-white">Leadership</button></li>
                <li><button className="hover:text-white">Careers</button></li>
                <li><button className="hover:text-white">Press</button></li>
                <li><button className="hover:text-white">Contact us</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                © 2026 ETN - Ethiopian Talent Network
              </p>
              <div className="flex gap-6 text-sm">
                <button className="hover:text-white">Terms of Service</button>
                <button className="hover:text-white">Privacy Policy</button>
                <button className="hover:text-white">Accessibility</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
