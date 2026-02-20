const Hero = () => {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full opacity-10 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full opacity-10 -ml-48 -mb-48"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 animate-bounce">
            अब शुरू हो गया! ✨
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-devanagari">
            आदर्श VIDHYAPEETH
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-yellow-400 font-semibold">
            A Self Study Point
          </p>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto font-devanagari leading-relaxed">
            समर्पित विद्यार्थियों के लिए एक शांत,
            <br />
            व्यवस्थित और अनुशासित अध्ययन वातावरण।
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="tel:+918340405216"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition shadow-lg flex items-center justify-center space-x-2"
            >
              <i className="fas fa-phone"></i>
              <span>Call Now</span>
            </a>
            <a
              href="https://wa.me/918340405216?text=Hi,%20I%20want%20to%20know%20about%20seat%20availability"
              className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-lg flex items-center justify-center space-x-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp Now</span>
            </a>
            <a
              href="https://maps.app.goo.gl/P9z8TFvhqL3jSfhD6?g_st=aw"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center justify-center space-x-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-map-marker-alt"></i>
              <span>Visit Us</span>
            </a>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <i className="fas fa-clock text-3xl text-yellow-400 mb-2"></i>
              <p className="text-sm font-semibold">24×7 Open</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <i className="fas fa-snowflake text-3xl text-blue-300 mb-2"></i>
              <p className="text-sm font-semibold">AC Facility</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <i className="fas fa-wifi text-3xl text-green-400 mb-2"></i>
              <p className="text-sm font-semibold">Free Wi-Fi</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <i className="fas fa-video text-3xl text-red-400 mb-2"></i>
              <p className="text-sm font-semibold">CCTV Security</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
