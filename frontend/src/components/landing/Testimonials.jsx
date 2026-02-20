const Testimonials = () => {
  const testimonials = [
    {
      text: 'Peaceful environment helped me crack SSC CGL. Silent zone policy strictly followed hai.',
      author: 'Rahul K., Civil Services Aspirant',
    },
    {
      text: '24x7 open hone ki wajah se night study me bahut help mili. AC facility best hai!',
      author: 'Priya S., Banking Exam Aspirant',
    },
    {
      text: 'Very professional setup. CCTV security se parents bhi tension-free rehte hai.',
      author: 'Amit T., Railway Exam Student',
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Students Say
          </h2>
          <p className="text-gray-300">Real feedback from our students</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400"></i>
                ))}
              </div>
              <p className="mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
              <p className="font-semibold">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
