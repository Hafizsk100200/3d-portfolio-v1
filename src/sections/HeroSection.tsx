import React, { useState, useEffect } from 'react';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';
import heroPortrait from '../assets/hero_portrait.png';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  isIntroFinished?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isIntroFinished = false }) => {
  // Delayed flag so hero title text only appears AFTER loading screen has fully vanished
  const [showHeroTitle, setShowHeroTitle] = useState(false);

  useEffect(() => {
    if (isIntroFinished) {
      // Wait for loading name to slide up (~800ms) + start fading
      // then show the hero title underneath
      const timer = setTimeout(() => setShowHeroTitle(true), 900);
      return () => clearTimeout(timer);
    }
  }, [isIntroFinished]);
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Price', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#contact') {
      e.preventDefault();
      window.location.hash = '#contact';
      return;
    }

    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen w-full flex flex-col justify-between bg-transparent select-none z-20">

      {/* 1. Navbar */}
      {/* Navbar — drops down from top after portrait */}
      <FadeIn delay={1.6} y={-30} duration={0.7} as="nav" animateOnMount={isIntroFinished}>
        <div className="w-full flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>
      </FadeIn>

      {/* 2. Hero Heading & Portrait Wrapper */}
      <div className="relative flex-grow w-full">
        {/* Hero Heading */}
        <div className="absolute top-[2%] sm:top-[3%] md:top-[4%] lg:top-[2%] left-0 w-full text-center z-0">
          <div className="relative w-full left-0">
            {/* Scribble wavy line — draws FIRST after loading screen vanishes */}
            <svg
              className="absolute inset-0 w-full h-[150%] top-[-25%] left-0 pointer-events-none z-0 overflow-visible"
              viewBox="0 0 1000 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="scribbleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00F2FE" />
                  <stop offset="50%" stopColor="#4FACFE" />
                  <stop offset="100%" stopColor="#00F2FE" />
                </linearGradient>
                <filter id="scribbleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M 50 120 C 150 120, 200 40, 300 40 C 400 40, 420 160, 500 160 C 580 160, 600 30, 700 30 C 800 30, 850 130, 950 100"
                stroke="url(#scribbleGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#scribbleGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isIntroFinished ? {
                  pathLength: 1,
                  opacity: 0.85,
                } : { pathLength: 0, opacity: 0 }}
                transition={{
                  pathLength: { delay: 0.9, duration: 1.6, ease: "easeOut" },
                  opacity: { delay: 0.9, duration: 0.4 },
                }}
              />
            </svg>
            
            {/* Hero title — stays invisible for measurement, fades in AFTER loading screen is gone */}
            <h1 
              className="hero-heading hero-title font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[11vw] sm:text-[12vw] md:text-[13vw] lg:text-[14.5vw] select-none relative z-10 transition-opacity duration-[600ms] ease-in-out"
              style={{ opacity: showHeroTitle ? 1 : 0 }}
            >
              <span id="hero-title-target" className="inline-block">Hi, i&apos;m Hafiz</span>
            </h1>
          </div>
        </div>

        {/* Portrait — rises up from below after scribble line starts */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-[58%] -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:-bottom-10 pointer-events-auto">
          <FadeIn delay={1.2} y={50} duration={1.0} animateOnMount={isIntroFinished}>
            <Magnet
              padding={150}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
              className="w-full h-full flex justify-center items-end"
            >
              <img
                src={heroPortrait}
                alt="Hafiz Portrait"
                className="w-full object-contain pointer-events-none select-none filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                loading="eager"
              />
            </Magnet>
          </FadeIn>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end z-20">
        {/* Left Informational text */}
        {/* Bottom left text — slides in from left */}
        <FadeIn delay={1.8} x={-40} y={0} duration={0.7} animateOnMount={isIntroFinished}>
          <p
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>

        {/* Right Contact Pill — slides in from right */}
        <FadeIn delay={1.8} x={40} y={0} duration={0.7} animateOnMount={isIntroFinished}>
          <Magnet padding={40} strength={4}>
            <ContactButton />
          </Magnet>
        </FadeIn>
      </div>

    </section>
  );
};

export default HeroSection;
