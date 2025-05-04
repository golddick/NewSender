
'use client';


import { useState } from 'react';
import { ChevronRight, Menu, X, Mail, Code, Users, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">the<span className="text-amber-400">News</span></h1>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#features" className="text-white hover:text-amber-400 transition-colors">Features</a>
            <a href="#pricing" className="text-white hover:text-amber-400 transition-colors">Pricing</a>
            <a href="#developers" className="text-white hover:text-amber-400 transition-colors">Developers</a>
            <a href="/documentation" className="text-white hover:text-amber-400 transition-colors">Documentation</a>
            <button className="bg-transparent border border-white hover:border-amber-400 text-white hover:text-amber-400 font-medium py-1 px-4 rounded-md transition-colors">Login</button>
            <button className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-1 px-4 rounded-md transition-colors">Sign Up</button>
          </div>
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white p-4 fixed top-16 left-0 right-0 z-40">
          <div className="flex flex-col space-y-3">
            <a href="#features" className="text-white hover:text-amber-400 transition-colors text-left py-2">Features</a>
            <a href="#pricing" className="text-white hover:text-amber-400 transition-colors text-left py-2">Pricing</a>
            <a href="#developers" className="text-white hover:text-amber-400 transition-colors text-left py-2">Developers</a>
            <a href="/documentation" className="text-white hover:text-amber-400 transition-colors text-left py-2">Documentation</a>
            <button className="bg-transparent border border-white hover:border-amber-400 text-white hover:text-amber-400 font-medium py-2 px-4 rounded-md transition-colors w-full">Login</button>
            <button className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-md transition-colors w-full mt-2">Sign Up</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Supercharge Your <span className="text-amber-400">Email Marketing</span></h1>
              <p className="text-xl text-gray-300 mb-8">Powerful newsletter platform with developer-friendly API integration. Reach your audience where it matters most – their inbox.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-3 px-6 rounded-md transition-colors text-lg">Start for Free</button>
                <button className="bg-transparent border border-white hover:border-amber-400 text-white hover:text-amber-400 font-medium py-3 px-6 rounded-md transition-colors text-lg">View Documentation</button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-xl relative z-10">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 text-gray-400 text-sm">API Request</div>
                </div>
                <pre className="bg-gray-900 p-4 rounded-md text-green-400 overflow-x-auto">
{`// Add a subscriber to your newsletter
fetch('https://api.thenews.com/v1/subscribers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    listId: 'list_123'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));`}
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-amber-400 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute -top-4 -left-4 w-48 h-48 bg-amber-400 rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-4xl font-bold text-amber-500 mb-2">10M+</p>
              <p className="text-gray-700">Emails Delivered Monthly</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-4xl font-bold text-amber-500 mb-2">5,000+</p>
              <p className="text-gray-700">Active Customers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-4xl font-bold text-amber-500 mb-2">99.9%</p>
              <p className="text-gray-700">Delivery Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for <span className="text-amber-500">Modern Marketers</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to grow your audience and engage your subscribers with beautiful newsletters.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Templates</h3>
              <p className="text-gray-600">Professionally designed templates that look great on any device. Customize them to match your brand.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audience Segmentation</h3>
              <p className="text-gray-600">Target specific groups of subscribers based on their behavior, preferences, and demographics.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Developer API</h3>
              <p className="text-gray-600">Integrate email marketing into your applications with our easy-to-use RESTful API.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automation</h3>
              <p className="text-gray-600">Create automated email sequences that trigger based on subscriber actions or specific dates.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-600">Built-in tools to help you stay compliant with data protection regulations worldwide.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">Detailed reports on open rates, click-through rates, and subscriber engagement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developers" className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for <span className="text-amber-400">Developers</span></h2>
              <p className="text-xl text-gray-300 mb-6">Integrate newsletter functionality into your applications with our simple and powerful API.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-amber-400 mr-2 mt-1 flex-shrink-0" />
                  <span>RESTful API with comprehensive documentation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-amber-400 mr-2 mt-1 flex-shrink-0" />
                  <span>SDK libraries for popular programming languages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-amber-400 mr-2 mt-1 flex-shrink-0" />
                  <span>Webhook support for real-time event notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-amber-400 mr-2 mt-1 flex-shrink-0" />
                  <span>Detailed API logs and error reporting</span>
                </li>
              </ul>
              
              <a href="/documentation" className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-black font-medium py-3 px-6 rounded-md transition-colors text-lg">
                Explore API Documentation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
            
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 text-gray-400 text-sm">Code Example</div>
                </div>
                <pre className="bg-gray-900 p-4 rounded-md text-green-400 overflow-x-auto">
{`// Initialize the theNews client
const theNews = require('thenews-sdk');
const client = new theNews('YOUR_API_KEY');

// Create a newsletter campaign
async function createCampaign() {
  try {
    const campaign = await client.campaigns.create({
      name: 'Product Launch Newsletter',
      subject: 'Introducing Our New Product!',
      fromName: 'Your Company',
      fromEmail: 'news@yourcompany.com',
      listId: 'list_123',
      content: {
        html: '<h1>Hello!</h1><p>Check out our new product...</p>',
        text: 'Hello! Check out our new product...'
      }
    });
    
    console.log('Campaign created:', campaign.id);
    return campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple <span className="text-amber-500">Pricing</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the plan that fits your needs. All plans include access to our developer API.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <p className="text-gray-600 mb-4">Perfect for small businesses and startups</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Up to 10,000 subscribers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>50,000 emails per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>API access (100 req/hour)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-md transition-colors">Get Started</button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-xl border-2 border-amber-400 relative">
              <div className="bg-amber-400 text-black text-center py-1 font-medium">MOST POPULAR</div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <p className="text-gray-600 mb-4">For growing businesses and teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Up to 50,000 subscribers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>250,000 emails per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Advanced templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>API access (1,000 req/hour)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Email & chat support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Automation workflows</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-md transition-colors">Get Started</button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">For large organizations and agencies</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Unlimited subscribers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>1 million emails per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Custom templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>API access (10,000 req/hour)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-md transition-colors">Contact Sales</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-400 to-amber-500 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to grow your audience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of businesses that use theNews to connect with their customers. Start your free trial today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-md transition-colors text-lg">Start Free Trial</button>
            <button className="bg-white hover:bg-gray-100 text-black font-medium py-3 px-8 rounded-md transition-colors text-lg">Schedule Demo</button>
          </div>
        </div>
      </section>

</div>

  )

}