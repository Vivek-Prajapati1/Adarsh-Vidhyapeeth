const WhyChooseUs = () => {
  const features = [
    {
      icon: 'fa-user-graduate',
      gradient: 'from-orange-500 to-yellow-500',
      title: 'For Serious Aspirants',
      description:
        'UPSC, SSC, Railway, Banking और competitive exams की तैयारी के लिए ideal environment.',
    },
    {
      icon: 'fa-volume-mute',
      gradient: 'from-blue-500 to-blue-700',
      title: 'Silent Environment',
      description:
        'Strictly maintained silence policy. Zero distraction, maximum concentration.',
    },
    {
      icon: 'fa-book-reader',
      gradient: 'from-green-500 to-green-700',
      title: 'Pure Self-Study',
      description:
        'कोई coaching नहीं, सिर्फ self-study के लिए बनाया गया dedicated space.',
    },
    {
      icon: 'fa-shield-alt',
      gradient: 'from-red-500 to-pink-500',
      title: 'Safe for Everyone',
      description:
        'CCTV monitoring, safe neighborhood. Girls के लिए reserved seating available.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            हम सिर्फ एक library नहीं, बल्कि serious students के लिए बनाया गया एक
            complete study ecosystem हैं।
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mb-4`}
              >
                <i className={`fas ${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
