import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';
import { ArrowUp, Github, Linkedin, Instagram, Mail } from 'lucide-react';

interface FooterProps {
  showCTA?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ showCTA = false }) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { icon: <Mail size={20} />, href: 'mailto:hafizsk100200@gmail.com', name: 'Email' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: <Github size={20} />, href: 'https://github.com', name: 'GitHub' },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/hafiz.sk_/', name: 'Instagram' },
  ];

  return (
    <footer
      id="footer"
      className="relative w-full bg-transparent pt-20 pb-0 px-6 md:px-12 flex flex-col justify-between overflow-visible select-none z-30 animate-none"
    >
      
      {/* 1. Main Footer Content Container */}
      <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full relative z-10">
        {showCTA && (
          <>
            {/* Massive Call to Action Title */}
            <div className="mb-8">
              <FadeIn delay={0.1} y={30} duration={0.8}>
                <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[2.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[8rem]">
                  Let&apos;s build it
                </h2>
              </FadeIn>
            </div>

            {/* Contact description text */}
            <div className="mb-10 max-w-lg">
              <FadeIn delay={0.2} y={20} duration={0.8}>
                <p className="text-[#D7E2EA]/60 uppercase text-xs sm:text-sm tracking-widest font-light leading-relaxed">
                  Have an exciting project or idea in mind? Let&apos;s team up and craft an unforgettable 3D or web experience together.
                </p>
              </FadeIn>
            </div>

            {/* Interactive Gradient Contact Button */}
            <div className="mb-10">
              <FadeIn delay={0.3} y={20} duration={0.8}>
                <Magnet padding={30} strength={4}>
                  <ContactButton />
                </Magnet>
              </FadeIn>
            </div>
          </>
        )}

        {/* 2. Social Icons row (Cleanly positioned directly below the button) */}
        <div className="flex gap-6 sm:gap-8 items-center justify-center mt-6 mb-16 sm:mb-20">
          {socials.map((social, index) => (
            <FadeIn key={social.name} delay={0.1 + index * 0.08} y={15} duration={0.6}>
              <Magnet padding={15} strength={3}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center text-[#D7E2EA]/60 hover:text-[#D7E2EA] hover:border-[#D7E2EA] transition-all duration-300 bg-white/5"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              </Magnet>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* 3. Bottom Footer Credits row */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 text-[#D7E2EA]/30 text-xs uppercase tracking-widest font-light select-none z-10 pt-8 mt-12 border-t border-[#D7E2EA]/5">
        {/* Signatures */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center text-center sm:text-left">
          <span>© 2026 Shaik Hafiz. All rights reserved.</span>
          <span className="hidden sm:inline text-[#D7E2EA]/20">|</span>
          <span>Crafted &amp; Developed by Hafiz.</span>
        </div>

        {/* Scroll back to top with Magnet */}
        <Magnet padding={20} strength={3}>
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 group hover:text-[#D7E2EA] transition-colors duration-200 cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <span className="w-8 h-8 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center group-hover:border-[#D7E2EA] transition-all duration-300">
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          </button>
        </Magnet>
      </div>

      {/* 4. Massive Background Watermark Name - Placed in the normal flow at the entire bottom of the page */}
      <div className="w-full text-center select-none pointer-events-none z-10 overflow-visible whitespace-nowrap mt-24 pb-0 translate-x-[-0.8vw] translate-y-[2.2vw]">
        <h1 
          className="font-black uppercase tracking-tight leading-none select-none text-[10.5vw] sm:text-[11.8vw] md:text-[13vw] lg:text-[14.2vw]"
          style={{
            fontFamily: "'Harmond SemBd Cond', serif",
            background: 'linear-gradient(180deg, rgba(215, 226, 234, 0.15) 0%, rgba(215, 226, 234, 0.01) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
          }}
        >
          Shaik{'\u00A0'}Abdul{'\u00A0'}Hafiz
        </h1>
      </div>

    </footer>
  );
};

export default Footer;
