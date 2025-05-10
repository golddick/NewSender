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


      {/* About Content */}
      <AboutMission/>


      <AboutParent/>

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