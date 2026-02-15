import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Background images/content for slider
  const slides = [
    {
      title: "Excellence in Education",
      subtitle: "A perfect environment for focused study",
      gradient: "from-blue-900 via-blue-800 to-indigo-900"
    },
    {
      title: "Modern Study Facilities",
      subtitle: "Equipped with all amenities for your success",
      gradient: "from-indigo-900 via-purple-800 to-blue-900"
    },
    {
      title: "Peaceful Learning Space",
      subtitle: "Where knowledge meets dedication",
      gradient: "from-purple-900 via-indigo-800 to-blue-900"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Animated Background Banner */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Sliding Background */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
            </div>
            
            {/* Subtle Decorative Elements */}
            <div className="absolute top-10 right-10 w-40 h-40 border-2 border-white opacity-10 rounded-full"></div>
            <div className="absolute top-32 right-32 w-24 h-24 border-2 border-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-32 left-32 w-32 h-32 border-2 border-white opacity-10 rounded-full"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
              {/* Logo */}
              <div className="mb-12">
                <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-2xl border border-white border-opacity-20">
                  <img 
                    src="/logo.svg" 
                    alt="Logo" 
                    className="w-24 h-24 mx-auto mb-4"
                  />
                  <h1 className="text-4xl font-bold font-devanagari mb-2 text-center">
                    आदर्श VIDHYAPEETH
                  </h1>
                  <p className="text-lg text-blue-100 text-center">
                    A Self Study Point
                  </p>
                </div>
              </div>

              {/* Slide Content */}
              <div className="text-center mt-8 max-w-2xl">
                <h2 className="text-3xl font-bold mb-3 animate-fadeIn">
                  {slide.title}
                </h2>
                <p className="text-lg text-blue-100 animate-fadeIn">
                  {slide.subtitle}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-2xl">
                <div className="text-center p-5 bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold mb-2">121</div>
                  <div className="text-sm text-blue-100">Total Seats</div>
                </div>
                <div className="text-center p-5 bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold mb-2">12hr</div>
                  <div className="text-sm text-blue-100">Daily Access</div>
                </div>
                <div className="text-center p-5 bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm text-blue-100">Support</div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex space-x-3 mt-12">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-white w-8' 
                        : 'bg-white bg-opacity-40 w-2 hover:bg-opacity-60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-blue-900 font-devanagari mb-2">
              आदर्श VIDHYAPEETH
            </h1>
            <p className="text-gray-600">A Self Study Point</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="hidden lg:flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Staff Login Portal
              </h2>
              <p className="text-gray-500 text-sm">
                Enter your credentials to access the system
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="spinner-small mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                For admin & director access only
              </p>
            </div>
          </div>

          {/* Back to Website */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 transition text-sm font-medium inline-flex items-center"
            >
              ← Back to Website
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-gray-500">
            <p>© 2026 Adarsh Vidhyapeeth. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
