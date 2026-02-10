import React, { useState, useEffect } from 'react';
import { Search, Menu, ChevronLeft, ChevronRight, Briefcase, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop',
    title: 'Join us & Explore\nThousands of Jobs',
    subtitle: "Find Jobs, Employment & Career Opportunities. Some of the companies\nwe've helped recruit excellent applicants over the years."
  },
  {
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&h=900&fit=crop',
    title: 'Work from Anywhere\nin the World',
    subtitle: 'Discover remote opportunities that fit your lifestyle. Build your career\nwithout the constraints of a traditional office.'
  },
  {
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=900&fit=crop',
    title: 'Connect with Top\nTech Companies',
    subtitle: 'From startups to giants, find the perfect match for your skills.\nYour next big break is just a click away.'
  }
];

export default function JobPortalHero() {
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const popularSearches = ['Designer', 'Developer', 'Web', 'iOS', 'PHP Senior Engineer'];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    },2850);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col relative overflow-hidden">
      {/* Hero Carousel Section */}
      <div className="relative flex-1 overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40 z-10"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[10s] ease-linear"
              style={{
                backgroundImage: `url('${slide.image}')`,
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)'
              }}
            ></div>
            
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-3xl w-full">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight whitespace-pre-line animate-fade-in-up">
                  {slide.title}
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-8 sm:mb-10 leading-relaxed whitespace-pre-line max-w-2xl opacity-90">
                  {slide.subtitle}
                </p>

                {/* Search Box
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center max-w-2xl gap-2">
                  <div className="flex items-center flex-1 px-3 sm:px-4 py-2 sm:py-0">
                    <Briefcase className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Job Title, Keywords, or Company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 outline-none text-slate-700 placeholder-slate-400 text-base sm:text-lg bg-transparent"
                    />
                  </div>
                  <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95">
                    Search
                  </button>
                </div> */}

                {/* Popular Searches */}
                {/* <div className="mt-6 flex items-center flex-wrap gap-x-2 gap-y-1">
                  <span className="text-slate-300 font-medium text-sm sm:text-base">Popular Searches :</span>
                  {popularSearches.map((term, index) => (
                    <React.Fragment key={term}>
                      <button className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base underline-offset-4 hover:underline">
                        {term}
                      </button>
                      {index < popularSearches.length - 1 && (
                        <span className="text-slate-400">,</span>
                      )}
                    </React.Fragment>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-2 sm:px-4 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all pointer-events-auto active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all pointer-events-auto active:scale-90"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === currentSlide ? 'w-8 bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

