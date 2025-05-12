"use client"


// pages/coming-soon.js
import { useState } from 'react';
import Head from 'next/head';
import { Mail, ChevronRight, Book, FileText, ArrowRight } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = (e: HandleSubmitEvent): void => {
    e.preventDefault();
    // Here you would normally handle the subscription logic
    setIsSubmitted(true);
    setEmail('');
    // Reset submission status after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
};

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
    

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-600 text-sm font-medium mb-4">Coming Soon</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Blog & Resources Are On The Way</h2>
              <p className="text-lg md:text-xl text-gray-600 mb-10">Stay tuned for expert insights, tutorials, and best practices to elevate your email marketing strategy.</p>
              
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 justify-center max-w-md mx-auto">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
                >
                  Notify Me <ChevronRight size={18} className="ml-1" />
                </button>
              </form>
              
              {isSubmitted && (
                <div className="mt-4 text-green-600 font-medium">
                  Thank you! We&apos;ll notify you when we launch.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">What&apos;s Coming?</h3>
              <p className="text-gray-600">Explore our upcoming content sections designed to help you succeed.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="text-yellow-600" size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3">Blog</h4>
                <p className="text-gray-600 mb-4">Insightful articles, case studies, and industry trends to keep you informed about email marketing best practices.</p>
                <div className="flex items-center text-yellow-600 font-medium">
                  <span>Coming Soon</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-yellow-600" size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3">Resources</h4>
                <p className="text-gray-600 mb-4">Step-by-step tutorials, guides, and documentation to help you make the most of TheNews platform.</p>
                <div className="flex items-center text-yellow-600 font-medium">
                  <span>Coming Soon</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </div>
          </div>
        </section>

    
      </main>

    </div>
  );
}