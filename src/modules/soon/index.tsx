'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, ChevronRight, Book, FileText, ArrowRight } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get('https://thenews.africa/api/category', {
          headers: {
            'TheNews-api-key': process.env.NEXT_PUBLIC_TheNews_API_KEY!,
          },
        });

        const categories = res.data.data;
        if (categories.length > 0) {
          const cat = categories[2];
          console.log('Selected Category:', cat);
          setCategoryId(cat._id);
          setCategoryName(cat.name);
          setCampaignName(cat.campaigns[0]?.name || 'Coming Soon Page Campaign');
        }
      } catch (err) {
        console.error('Category fetch error:', err);
      }
    };

    fetchCategory();
  }, []);

  interface SubscribePayload {
    email: string;
    source: string;
    status: string;
    categoryId: string;
    metadata: {
      campaign: string;
      pageUrl: string;
      formId: string;
    };
  }

  interface AxiosErrorResponse {
    response?: {
      data?: {
        error?: string;
      };
    };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !categoryId) return;

    setLoading(true);
    setMessage('');
    try {
      const payload: SubscribePayload = {
        email,
        source: `${process.env.NEXT_PUBLIC_SOURCE}/category?${categoryName}`,
        status: 'Subscribed',
        categoryId,
        metadata: {
          campaign: campaignName,
          pageUrl: `${process.env.NEXT_PUBLIC_SOURCE}/${categoryName}`,
          formId: 'coming-soon-form',
        },
      };

      const res = await axios.post('https://thenews.africa/api/subscribe', payload, {
        headers: {
          'TheNews-api-key': process.env.NEXT_PUBLIC_TheNews_API_KEY!,
        },
      });

      if (res.status === 200) {
        setMessage('✅ Successfully subscribed!');
        setEmail('');
        setIsSubmitted(true);
      } else {
        setMessage('⚠️ Something went wrong.');
      }
    } catch (err) {
      let errorMsg = '❌ Subscription failed.';
      if (axios.isAxiosError(err) && (err as AxiosErrorResponse).response?.data?.error) {
        errorMsg = (err as AxiosErrorResponse).response!.data!.error!;
      }
      setMessage(errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => setIsSubmitted(false), 4000);
    }
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
              <p className="text-lg md:text-xl text-gray-600 mb-10">
                Stay tuned for expert insights, tutorials, and best practices to elevate your email marketing strategy.
              </p>

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
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
                >
                  {loading ? 'Subscribing...' : (
                    <>
                      Notify Me <ChevronRight size={18} className="ml-1" />
                    </>
                  )}
                </button>
              </form>

              {message && (
                <div className={`mt-4 font-medium ${isSubmitted ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
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
                <p className="text-gray-600 mb-4">
                  Insightful articles, case studies, and industry trends to keep you informed about email marketing best practices.
                </p>
               
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-yellow-600" size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3">Resources</h4>
                <p className="text-gray-600 mb-4">
                  Step-by-step tutorials, guides, and documentation to help you make the most of TheNews platform.
                </p>
               
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
