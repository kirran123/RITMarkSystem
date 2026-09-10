import React from 'react';
import { MapPin, Phone, Mail, Globe, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#edf2f7] text-slate-700 pt-16 pb-12 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Left Column: College Name and Description */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/rit-logo.png"
                alt="Ramco Institute of Technology"
                className="w-12 h-12 rounded-xl shadow-sm border border-slate-300 bg-white p-0.5 object-contain"
              />
              <h3 className="text-xl sm:text-2xl font-black text-[#0b192c] font-['Outfit',sans-serif]">
                Ramco Institute of Technology
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              RIT is a prestigious institution committed to providing high-quality engineering education. Our Mark Calculation System streamlines grade calculations and activity log analytics for staff and administrators.
            </p>
          </div>

          {/* Right Column: Contact Us */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-base sm:text-lg font-black text-[#0b192c] font-['Outfit',sans-serif]">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <div>North Venganallur Village,</div>
                  <div>Rajapalayam – 626 117,</div>
                  <div>Virudhunagar District, Tamil Nadu.</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-900 flex-shrink-0" />
                <a
                  href="tel:04563233400"
                  className="hover:text-blue-900 transition-colors"
                >
                  04563 233400
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-900 flex-shrink-0" />
                <a
                  href="mailto:rit@ritrjpm.ac.in"
                  className="hover:text-blue-900 transition-colors"
                >
                  rit@ritrjpm.ac.in
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-900 flex-shrink-0" />
                <a
                  href="https://www.ritrjpm.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-900 transition-colors font-medium"
                >
                  www.ritrjpm.ac.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-slate-300/80 pt-8 text-center space-y-2">
          {/* Copyright & Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            © 2026 Ramco Institute of Technology. All Rights Reserved.
          </p>
          <p className="text-xs text-slate-500">
            Developed for academic Mark Calculation & performance tracking.
          </p>

          {/* Developer Credit */}
          <div className="pt-3 space-y-1">
            <p className="text-xs sm:text-sm text-slate-700">
              Designed & developed by <span className="font-bold text-slate-900">Kirran S T</span>
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Dept. of Information Technology
            </p>

            {/* Social Links with updated URLs */}
            <div className="flex items-center justify-center gap-3 pt-2 text-xs font-semibold text-blue-900">
              <a
                href="https://www.linkedin.com/in/kirran-s-t-694031291/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-950 hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5 fill-blue-900 text-transparent" />
                <span>LinkedIn</span>
              </a>
              <span className="text-slate-400">|</span>
              <a
                href="https://kirran123.github.io/Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-950 hover:underline"
              >
                <Globe className="w-3.5 h-3.5 text-blue-900" />
                <span>Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
