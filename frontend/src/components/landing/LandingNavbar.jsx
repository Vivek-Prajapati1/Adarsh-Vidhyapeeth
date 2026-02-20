import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`bg-white shadow-md fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'scrolled' : ''
      }`}
      id="navbar"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12">
              <img src="/logo.svg" alt="Adarsh Vidhyapeeth Logo" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900 font-devanagari">
                आदर्श VIDHYAPEETH
              </h1>
              <p className="text-xs text-gray-600">A Self Study Point</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('home')}
              className="text-blue-900 font-semibold border-b-2 border-orange-500"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('facilities')}
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Facilities
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Contact
            </button>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <i className="fas fa-lock"></i> Staff Login
            </Link>
            <a
              href="https://wa.me/918340405216?text=Hi,%20I%20want%20to%20know%20about%20seat%20availability"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4" id="mobile-menu">
            <button
              onClick={() => scrollToSection('home')}
              className="block py-2 text-blue-900 font-semibold w-full text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block py-2 text-gray-700 hover:text-orange-500 w-full text-left"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('facilities')}
              className="block py-2 text-gray-700 hover:text-orange-500 w-full text-left"
            >
              Facilities
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block py-2 text-gray-700 hover:text-orange-500 w-full text-left"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block py-2 text-gray-700 hover:text-orange-500 w-full text-left"
            >
              Contact
            </button>
            <Link
              to="/login"
              className="block py-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <i className="fas fa-lock mr-2"></i>Staff Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
