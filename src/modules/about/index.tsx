'use client'


import { AboutMission } from '@/app/about/_component/aboutMission';
import { AboutParent } from '@/app/about/_component/aboutParent';
import { AboutHero } from '@/app/about/_component/header';
import { XFooter } from '@/shared/widgets/footer/footer';
import Header from '@/shared/widgets/header';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
    

         <Header />

      {/* Hero Section */}
      <AboutHero/>
      {/* <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-gold">theNews</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Empowering developers with seamless newsletter integration capabilities
            </p>
          </div>
        </div>
      </section> */}

      {/* About Content */}
      <AboutMission/>

      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                At theNews, we're on a mission to simplify newsletter integration for developers. We provide robust APIs that seamlessly connect to your platforms, enabling efficient and effective communication with your subscribers.
              </p>
              <p className="text-gray-700 mb-6">
                As a product of SixthGrid, we leverage years of experience in software development to create tools that truly enhance developer workflows and user experiences.
              </p>
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-gold">
                <p className="italic text-gray-800">
                  "We believe that effective communication should be accessible to all developers, regardless of their platform or technical expertise."
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="relative h-64 md:h-80 w-full mb-6 bg-gray-200 rounded-lg">
                Replace with actual image
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400">Platform Image</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Why Choose theNews?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-gold mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Developer-friendly API integration</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-gold mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Scalable infrastructure for any size audience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-gold mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comprehensive documentation and support</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-gold mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Backed by SixthGrid's technical expertise</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      {/* SixthGrid Section */}

      <AboutParent/>

      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">A Product of SixthGrid</h2>
            <div className="h-1 w-24 bg-gold mx-auto mt-4"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg mb-8 text-center">
              SixthGrid is a forward-thinking tech company specializing in innovative software solutions. With a track record of successful products like Xonnect, our streaming platform, we continue to push boundaries in the digital space.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Our Products</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-gold rounded-full mr-2"></span>
                    <span><span className="font-medium">theNews</span> - Email Marketing Platform</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-gold rounded-full mr-2"></span>
                    <span><span className="font-medium">Xonnect</span> - Streaming Platform</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-gold rounded-full mr-2"></span>
                    <span>And more innovative solutions...</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Our Values</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-gold rounded-full mr-2"></span>
                    <span>Innovation-driven development</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-gold rounded-full mr-2"></span>
                    <span>Developer-first approach</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-gold rounded-full mr-2"></span>
                    <span>Scalable and reliable solutions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to elevate your newsletter experience?</h2>
            <p className="text-gray-300 mb-8">
              Get started with theNews API today and transform how you connect with your subscribers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/documentation" className="bg-gold-700 hover:bg-gold-500 text-black font-bold py-3 px-8 rounded-md transition duration-300">
                Explore API Documentation
              </Link>
              <Link href="/sign-up" className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-8 border border-white rounded-md transition duration-300">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <XFooter />

     
    </div>
  );
}