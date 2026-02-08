import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, MessageCircle, HelpCircle } from 'lucide-react';

const QuestionsAnswersAccordion = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How our Jobstack work?",
      answer: "Due to its widespread use as filler text for layouts, non-readability is of great importance: human perception is tuned to recognize certain patterns and repetitions in texts."
    },
    {
      id: 2,
      question: "What is the main process open account?",
      answer: "Words are random, the reader will not be distracted from making a neutral judgement on the visual impact."
    },
    {
      id: 3,
      question: "How to make unlimited data entry?",
      answer: "Furthermore, it is advantageous when the dummy text is relatively realistic so that the layout impression of the final publication is not compromised."
    },
    {
      id: 4,
      question: "Is Jobstack safer to use with my account?",
      answer: "The most well-known dummy text is the 'Lorem Ipsum', which is said to have originated in the 16th century. Lorem Ipsum is composed in a pseudo-Latin language which corresponds to 'proper' Latin."
    },
    {
      id: 5,
      question: "How can I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password."
    },
    {
      id: 6,
      question: "What are the payment methods available?",
      answer: "We accept various payment methods including credit cards, debit cards, PayPal, and bank transfers. All transactions are secured with industry-standard encryption."
    }
  ];

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="bg-slate-50 py-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Questions & Answers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about the platform. Can't find the answer you're looking for? Reach out to our support team.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`bg-white rounded-[32px] p-8 transition-all duration-500 cursor-pointer border-2 ${
                openQuestion === faq.id 
                  ? 'border-emerald-500 shadow-2xl scale-[1.02]' 
                  : 'border-transparent shadow-sm hover:shadow-xl hover:border-emerald-100'
              }`}
              onClick={() => toggleQuestion(faq.id)}
            >
              <div className="flex gap-5">
                {/* Question Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    openQuestion === faq.id 
                      ? 'bg-emerald-500 text-white rotate-[360deg]' 
                      : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {openQuestion === faq.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <HelpCircle className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${
                      openQuestion === faq.id ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {faq.question}
                    </h3>
                    {openQuestion === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openQuestion === faq.id ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-20 bg-slate-900 rounded-[40px] p-12 shadow-2xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-4xl font-extrabold mb-6">
              Still have questions?
            </h3>
            <p className="text-slate-400 mb-10 text-xl leading-relaxed">
              We're here to help! If you can't find your answer in our FAQ, our support team is available 24/7 to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-500/25 active:scale-95">
                Contact Our Team
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all border border-white/10 active:scale-95">
                Browse Full Documentation
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { label: 'Questions Resolved', value: '1,200+', color: 'text-emerald-500' },
            { label: 'Response Time', value: '< 2 Hours', color: 'text-blue-500' },
            { label: 'Satisfaction Rate', value: '99.9%', color: 'text-purple-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-xl transition-all duration-300">
              <div className={`text-4xl font-black ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsAnswersAccordion;
