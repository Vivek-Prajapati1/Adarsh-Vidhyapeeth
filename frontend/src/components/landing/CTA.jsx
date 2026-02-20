const CTA = () => {
  return (
    <section id="contact" className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Visit us anytime for a FREE TRIAL. देखिये facility, फिर decide कीजिये.
          <br />
          No appointment needed!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+918340405216"
            className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition shadow-lg"
          >
            <i className="fas fa-phone mr-2"></i> 83404 05216
          </a>
          <a
            href="tel:+918083185503"
            className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition shadow-lg"
          >
            <i className="fas fa-phone mr-2"></i> 80831 85503
          </a>
          <a
            href="tel:+919504838838"
            className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition shadow-lg"
          >
            <i className="fas fa-phone mr-2"></i> 95048 38838
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
