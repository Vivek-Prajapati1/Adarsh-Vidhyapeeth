const Facilities = () => {
  const facilities = [
    {
      icon: 'fa-video',
      color: 'text-red-500',
      title: 'CCTV Cameras',
      description: '24×7 monitoring for complete safety',
    },
    {
      icon: 'fa-snowflake',
      color: 'text-blue-500',
      title: 'AC with Strong Cooling',
      description: 'Perfect temperature maintained',
    },
    {
      icon: 'fa-shoe-prints',
      color: 'text-orange-500',
      title: 'Free Shoe Locker',
      description: 'Personal locker for everyone',
    },
    {
      icon: 'fa-newspaper',
      color: 'text-gray-700',
      title: 'Magazine & Daily Paper',
      description: 'Current affairs और news updates',
    },
    {
      icon: 'fa-lightbulb',
      color: 'text-yellow-500',
      title: 'Eye Protection Lighting',
      description: 'Comfortable lighting in every cabin',
    },
    {
      icon: 'fa-tint',
      color: 'text-blue-400',
      title: 'R.O. Water',
      description: 'Pure drinking water available',
    },
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="facilities" className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Our Facilities
          </h2>
          <p className="text-gray-600">
            हर facility को students की comfort को ध्यान में रखते हुए design किया
            गया है।
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex items-start space-x-4 shadow hover:shadow-lg transition"
            >
              <i className={`fas ${facility.icon} text-3xl ${facility.color}`}></i>
              <div>
                <h3 className="font-bold text-lg text-blue-900 mb-1">
                  {facility.title}
                </h3>
                <p className="text-gray-600 text-sm">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={scrollToContact}
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Contact Us <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
