'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Sparkles, ChevronRight, Menu, X, Check, ArrowRight, Heart, Smartphone, Zap, ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqList = [
    {
      question: "How do I customize the Royal Burgundy theme with our names and wedding details?",
      answer: "Customizing is effortless! Once you click 'Start Customizing' and connect via WhatsApp, you simply provide your couple names, wedding date, venue location, and event times. Our design concierge configures your bespoke digital suite within 24 hours."
    },
    {
      question: "Can I choose which features to include in my invitation?",
      answer: "Yes, absolutely! You have full flexibility. You can choose whether you want to include guest RSVP forms, specific venue location links, event schedules (Katb Kitab/Reception), and our interactive e-photobooth feature with custom floral frames."
    },
    {
      question: "How do guests interact with the e-photobooth and digital guestbook?",
      answer: "When your guests open the digital invitation link on their smartphones, they can enter their names, take a photo directly inside the custom burgundy floral frame with your initials and date, and leave warm wishes in your live digital guestbook."
    },
    {
      question: "How and when do we receive our final invitation link?",
      answer: "Your invitation link is delivered directly to your WhatsApp within 24 hours of finalizing your details. You can instantly share it with all your wedding guests via WhatsApp, Instagram, or text message."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D3833] selection:bg-[#D4AF37]/20 font-sans antialiased">
      
      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EFECE6] px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl tracking-widest text-[#2C2621] uppercase font-semibold">
              Layali<span className="text-[#C5A059]">Hub</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase font-medium text-[#5A524A]">
            <a href="#home" className="hover:text-[#C5A059] transition-colors">Home</a>
            <a href="#collection" className="hover:text-[#C5A059] transition-colors">Collection</a>
            <a href="#benefits" className="hover:text-[#C5A059] transition-colors">Why Us</a>
            <a href="#faq" className="hover:text-[#C5A059] transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#collection" 
              className="bg-[#2C2621] text-[#FDFBF7] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-[#C5A059] transition-all shadow-sm"
            >
              Start Customizing
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#2C2621] focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#EFECE6] py-6 px-6 flex flex-col gap-4 shadow-xl">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest font-medium">Home</a>
            <a href="#collection" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest font-medium">Collection</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest font-medium">Why Us</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest font-medium">FAQ</a>
            <a 
              href="#collection" 
              onClick={() => setMobileMenuOpen(false)} 
              className="bg-[#2C2621] text-[#FDFBF7] text-center py-3 rounded-full text-xs uppercase tracking-widest mt-2"
            >
              Start Customizing
            </a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2EB] border border-[#E8E2D5] text-[#8C6D33] text-xs uppercase tracking-widest font-medium">
            <Sparkles size={12} />
            Exclusive Luxury Digital Wedding Invitations
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-[#2C2621] leading-[1.1]">
            Where Your Wedding Story <br />
            <span className="italic font-light text-[#A88746]">Becomes Living Art</span>
          </h1>
          
          <p className="text-[#6B6156] text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Replace traditional paper with an immersive digital wedding invitation. Crafted with interactive royal envelopes, custom photo frames, live guestbooks, and seamless WhatsApp RSVPs.
          </p>
        </div>
      </section>

      {/* SIGNATURE COLLECTION SECTION */}
      <section id="collection" className="py-24 px-6 bg-[#F5F2EB]/50 border-t border-[#EFECE6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8C6D33] font-semibold">Curated Designs</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C2621]">The Signature Collection</h2>
            <p className="text-[#6B6156] max-w-xl mx-auto font-light">Each wedding design is a masterpiece, custom-tailored for your sacred celebration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Burgundy (Active & Discounted) */}
            <div className="bg-white rounded-2xl p-6 border border-[#C5A059] shadow-md flex flex-col justify-between group">
              <div>
                <div className="aspect-[3/4] bg-[#2C2621] rounded-xl mb-6 overflow-hidden relative border border-[#F2ECE1] flex items-center justify-center">
                  <div className="absolute top-4 right-4 bg-[#C5A059] text-white text-[10px] uppercase px-3 py-1 rounded-full font-medium tracking-wider">50% OFF Launch</div>
                   <Image
    src="/images/theme1.png"
    alt="Royal Burgundy & Gold wedding invitation"
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    className="object-cover group-hover:scale-105 transition-transform duration-500"
  />
                  <div className="relative z-10 text-center p-4">
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37]">Royal Burgundy & Gold</span>
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-[#2C2621] mb-1">Royal Burgundy Wedding</h3>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl font-serif text-[#2C2621]">500 EGP</span>
                  <span className="text-sm text-stone-400 line-through">1,000 EGP</span>
                </div>
                <p className="text-[#6B6156] text-sm font-light mb-4">Velvet burgundy backdrop with embossed gold foil details, envelope opening animation, and guestbook.</p>
              </div>
              <a 
                href="/customize/theme1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#2C2621] text-[#FDFBF7] py-3 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#C5A059] transition-all shadow-sm text-center block"
              >
                Start Customizing
              </a>
            </div>

        
          </div>
        </div>
      </section>

      {/* WHY LAYALI HUB (BENEFITS SECTION) */}
      <section id="benefits" className="py-24 px-6 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8C6D33] font-semibold">Unmatched Excellence</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C2621]">Why Couples Choose LayaliHub</h2>
            <p className="text-[#6B6156] max-w-xl mx-auto font-light">Designed specifically for modern weddings, blending timeless luxury aesthetics with cutting-edge digital features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#EAE3D2] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8C6D33]">
                <Heart size={22} />
              </div>
              <h3 className="font-serif text-xl text-[#2C2621]">Bespoke Wedding Aesthetics</h3>
              <p className="text-sm text-[#6B6156] font-light leading-relaxed">Tailored exclusively for weddings with royal velvet backdrops, gold foil typography, and romantic visual details that reflect your authentic style.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#EAE3D2] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8C6D33]">
                <Smartphone size={22} />
              </div>
              <h3 className="font-serif text-xl text-[#2C2621]">Flawless Mobile Experience</h3>
              <p className="text-sm text-[#6B6156] font-light leading-relaxed">Optimized for every smartphone screen. Your wedding guests receive an effortless, high-performance digital invitation link instantly.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#EAE3D2] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8C6D33]">
                <Zap size={22} />
              </div>
              <h3 className="font-serif text-xl text-[#2C2621]">Instant RSVP & Guestbook</h3>
              <p className="text-sm text-[#6B6156] font-light leading-relaxed">Track wedding attendees seamlessly with direct WhatsApp RSVP integration and a live digital guestbook where friends leave wishes and photos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 bg-[#F5F2EB]/50 border-t border-[#EFECE6]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8C6D33] font-semibold">Common Questions</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C2621]">Frequently Asked Questions</h2>
            <p className="text-[#6B6156] max-w-xl mx-auto font-light">Everything you need to know about customizing your digital wedding invitation suite.</p>
          </div>

          <div className="space-y-4">
            {faqList.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-[#EAE3D2] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-lg text-[#2C2621]">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-[#C5A059] transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-sm text-[#6B6156] font-light leading-relaxed border-t border-[#F5F2EB] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2C2621] text-[#FDFBF7] py-16 px-6 border-t border-[#3D3833]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="font-serif text-2xl tracking-widest text-white uppercase font-semibold">
              Layali<span className="text-[#C5A059]">Hub</span>
            </span>
            <p className="text-xs text-stone-400 mt-2 font-light">Luxury digital wedding invitations crafted for modern romance.</p>
          </div>
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-stone-300">
            <a href="#home" className="hover:text-[#C5A059] transition-colors">Home</a>
            <a href="#collection" className="hover:text-[#C5A059] transition-colors">Collection</a>
            <a href="#benefits" className="hover:text-[#C5A059] transition-colors">Why Us</a>
            <a href="#faq" className="hover:text-[#C5A059] transition-colors">FAQ</a>
          </div>
          <p className="text-xs text-stone-500 font-light">&copy; {currentYear} LayaliHub SaaS. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}