import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ArrowLeft, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Redirect back to home after success
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-12 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all group font-medium"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Side - Contact Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
                Let's Get in{' '}
                <span className="text-emerald-600 block sm:inline">Touch</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                Have a question or want to work together? We'd love to hear from you. 
                Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {[
                { icon: Mail, label: 'Email', value: 'contact@jobportal.com', color: 'bg-emerald-100 text-emerald-600' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', color: 'bg-blue-100 text-blue-600' },
                { icon: MapPin, label: 'Office', value: '123 Business St, New York, NY', color: 'bg-purple-100 text-purple-600' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-500 border border-slate-100">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</h3>
                    <p className="text-lg font-bold text-slate-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Follow Our Journey</h3>
              <div className="flex gap-4">
                {[Linkedin, Twitter, Facebook, Instagram].map((Icon, idx) => (
                  <button
                    key={idx}
                    className="w-14 h-14 bg-white rounded-2xl shadow-sm hover:shadow-xl flex items-center justify-center hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
                  >
                    <Icon className="w-6 h-6 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-[40px] shadow-2xl p-8 lg:p-12 relative overflow-hidden border border-slate-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-[100px] -z-1 opacity-50"></div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-10">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-slate-300"
                  placeholder="Share your thoughts with us..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/30 border-t-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Send className="w-5 h-5" />
                  </div>
                  <p className="font-bold">Message sent! Redirecting you back home...</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
