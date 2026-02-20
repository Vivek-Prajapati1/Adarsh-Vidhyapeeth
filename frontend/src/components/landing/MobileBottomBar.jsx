const MobileBottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl md:hidden z-50 border-t border-gray-200">
      <div className="grid grid-cols-3 gap-1 p-2">
        <a
          href="tel:+918340405216"
          className="bg-orange-500 text-white py-3 rounded-lg text-center font-semibold flex flex-col items-center justify-center"
        >
          <i className="fas fa-phone text-xl mb-1"></i>
          <span className="text-xs">Call</span>
        </a>
        <a
          href="https://wa.me/918340405216?text=Hi,%20I%20want%20to%20know%20about%20seat%20availability"
          className="bg-green-500 text-white py-3 rounded-lg text-center font-semibold flex flex-col items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp text-xl mb-1"></i>
          <span className="text-xs">WhatsApp</span>
        </a>
        <a
          href="https://maps.app.goo.gl/P9z8TFvhqL3jSfhD6?g_st=aw"
          className="bg-blue-500 text-white py-3 rounded-lg text-center font-semibold flex flex-col items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fas fa-map-marker-alt text-xl mb-1"></i>
          <span className="text-xs">Location</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBottomBar;
