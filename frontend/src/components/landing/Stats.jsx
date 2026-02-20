const Stats = () => {
  return (
    <section className="bg-orange-500 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
          <div>
            <p className="text-4xl font-bold mb-2">150+</p>
            <p className="text-sm">Seating Capacity</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">24×7</p>
            <p className="text-sm">Always Open</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">100%</p>
            <p className="text-sm">Safe & Secure</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">AC</p>
            <p className="text-sm">Strong Cooling</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
