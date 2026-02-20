import { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import Facilities from '../components/landing/Facilities';
import Testimonials from '../components/landing/Testimonials';
import Location from '../components/landing/Location';
import CTA from '../components/landing/CTA';
import LandingFooter from '../components/landing/LandingFooter';
import MobileBottomBar from '../components/landing/MobileBottomBar';
import BackToTop from '../components/landing/BackToTop';
import '../assets/css/landing.css';

const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'Adarsh Vidhyapeeth | 24x7 Self Study Library in Sonpur';
  }, []);

  return (
    <div className="font-sans bg-gray-50">
      <LandingNavbar />
      <Hero />
      <Stats />
      <WhyChooseUs />
      <Facilities />
      <Testimonials />
      <Location />
      <CTA />
      <LandingFooter />
      <MobileBottomBar />
      <BackToTop />
    </div>
  );
};

export default LandingPage;
