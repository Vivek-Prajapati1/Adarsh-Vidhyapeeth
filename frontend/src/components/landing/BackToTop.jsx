import { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 md:bottom-8 right-4 bg-orange-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-orange-600 transition ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      id="back-to-top"
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
};

export default BackToTop;
