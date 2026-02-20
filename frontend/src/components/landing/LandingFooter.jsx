const LandingFooter = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-devanagari">
              आदर्श VIDHYAPEETH
            </h3>
            <p className="text-gray-300 text-sm mb-4">A Self Study Point</p>
            <p className="text-gray-400 text-sm">
              Professional self-study library for serious aspirants. 24×7 open
              with all modern facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-orange-400 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-orange-400 transition"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('facilities')}
                  className="hover:text-orange-400 transition"
                >
                  Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="hover:text-orange-400 transition"
                >
                  Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-orange-400 transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <i className="fas fa-phone mr-2 text-orange-400"></i> 95048 38838
              </li>
              <li>
                <i className="fas fa-phone mr-2 text-orange-400"></i> 80831 85503
              </li>
              <li>
                <i className="fas fa-phone mr-2 text-orange-400"></i> 83404 05216
              </li>
              <li>
                <i className="fas fa-map-marker-alt mr-2 text-orange-400"></i>{' '}
                Hospital Chowk, Prajapati Complex, Sonpur
              </li>
              <li>
                <i className="fas fa-clock mr-2 text-orange-400"></i> Open 24×7
              </li>
            </ul>
          </div>

          {/* Directors */}
          <div>
            <h3 className="text-lg font-bold mb-4">Directors</h3>
            <p className="text-gray-300 text-sm mb-2">
              <i className="fas fa-user-tie mr-2 text-orange-400"></i> Abhijeet
              Singh
            </p>
            <p className="text-gray-300 text-sm mb-4">
              <i className="fas fa-user-tie mr-2 text-orange-400"></i> Prince
              Singh
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/918340405216"
                className="text-green-400 hover:text-green-300 transition text-2xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition text-2xl"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                className="text-pink-400 hover:text-pink-300 transition text-2xl"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Adarsh Vidhyapeeth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
