const Location = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <i className="fas fa-map-marker-alt text-5xl mb-4"></i>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Easy to Reach</h2>
          <p className="text-lg mb-2">
            Hospital Chowk, Prajapati Complex, Sonpur
          </p>
          <p className="mb-6">
            Well-connected by bus/auto • Safe neighborhood • Landmark location
          </p>
          <a
            href="https://maps.app.goo.gl/P9z8TFvhqL3jSfhD6?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Directions <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Location;
