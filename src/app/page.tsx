'use client';

import { Camera, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Hero Section */}
        <div className="mb-12">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-soft mb-6">
              <Sparkles className="w-10 h-10 text-primary-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6 text-balance">
            Virtual Try-On
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-text-medium mb-12 text-balance max-w-xl mx-auto">
            See how an outfit looks on you in seconds. 
            <span className="gradient-text font-semibold"> Powered by AI.</span>
          </p>

          {/* CTA Button */}
          <Link
            href="/try-on"
            className="btn btn-primary btn-xl rounded-full inline-flex items-center gap-3 px-12 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
          >
            <Camera className="w-6 h-6" />
            Start Try-On
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-text-light text-sm">
            Experience the future of online shopping
          </p>
        </div>
      </div>
    </div>
  );
}
