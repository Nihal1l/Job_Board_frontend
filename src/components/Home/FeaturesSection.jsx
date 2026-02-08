import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Images Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-6">
            {/* Conference Room Image */}
            <div 
              className="col-span-2 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
              style={{ height: '300px' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop"
                alt="Modern Conference Room"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Professional Woman with Laptop */}
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
              style={{ height: '340px' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop"
                alt="Professional Woman"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Celebrating Professional */}
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
              style={{ height: '340px' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1000&fit=crop"
                alt="Celebrating Success"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Right Side - Content */}
        <div className="space-y-10">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Get the job of your dreams{' '}
              <span className="text-emerald-600">quick & easy.</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Search all the open positions on the web. Get your own personalized salary
              estimate. Read reviews on over 30,000+ companies worldwide.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-5">
            {[
              "Digital Marketing Solutions for Tomorrow",
              "Our Talented & Experienced Marketing Agency",
              "Create your own skin to match your brand"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-300">
                  <svg className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg group-hover:text-gray-900 transition-colors font-medium">
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Button */}
          <div className="pt-4">
            <button 
              onClick={handleContactClick}
              className="group bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact us
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
