import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'footer', label: 'Contact' },
];

interface ScrollProgressProps {
  isIntroFinished?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ isIntroFinished = false }) => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Show after intro finishes with a delay
  useEffect(() => {
    if (isIntroFinished) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isIntroFinished]);

  // Track which section is active
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          if (scrollY >= top - windowHeight * 0.4) {
            setActiveSection(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDotClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="fixed right-5 md:right-7 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-0"
      initial={{ opacity: 0, x: 20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Vertical track line */}
      <div className="relative" style={{ height: `${(sections.length - 1) * 52}px`, width: '2px' }}>
        {/* Background track */}
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        
        {/* Active fill line */}
        <motion.div
          className="absolute top-0 left-0 w-full rounded-full origin-top"
          style={{
            scaleY: smoothProgress,
            height: '100%',
            background: 'linear-gradient(180deg, #00F2FE 0%, #4FACFE 50%, #B600A8 100%)',
            boxShadow: '0 0 8px rgba(0, 242, 254, 0.4)',
          }}
        />
      </div>

      {/* Section dots overlaid on the track */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col justify-between"
        style={{ height: `${(sections.length - 1) * 52}px`, paddingTop: 0 }}
      >
        {sections.map((section, i) => {
          const isActive = i === activeSection;
          const isHovered = i === hoveredIndex;
          const dotY = i * 52;

          return (
            <div
              key={section.id}
              className="relative flex items-center"
              style={{ position: 'absolute', top: `${dotY}px`, left: '50%', transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => {
                if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);
                setHoveredIndex(i);
              }}
              onMouseLeave={() => {
                labelTimeoutRef.current = setTimeout(() => setHoveredIndex(null), 200);
              }}
            >
              {/* Dot */}
              <button
                onClick={() => handleDotClick(section.id)}
                className="relative flex items-center justify-center cursor-pointer group"
                aria-label={`Scroll to ${section.label}`}
                style={{ width: '16px', height: '16px' }}
              >
                {/* Outer ring on active */}
                <motion.div
                  className="absolute rounded-full"
                  animate={{
                    width: isActive ? 12 : 0,
                    height: isActive ? 12 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    border: '1px solid rgba(0, 242, 254, 0.4)',
                  }}
                />
                {/* Inner dot */}
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: isActive ? 5 : 3,
                    height: isActive ? 5 : 3,
                    backgroundColor: isActive ? '#00F2FE' : 'rgba(215, 226, 234, 0.35)',
                    boxShadow: isActive ? '0 0 6px rgba(0, 242, 254, 0.6)' : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </button>

              {/* Label tooltip */}
              <motion.span
                className="absolute right-full mr-3 text-[11px] font-medium uppercase tracking-widest whitespace-nowrap pointer-events-none select-none"
                initial={false}
                animate={{
                  opacity: isHovered || isActive ? 1 : 0,
                  x: isHovered || isActive ? 0 : 8,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  color: isActive ? '#00F2FE' : '#D7E2EA',
                  textShadow: isActive ? '0 0 10px rgba(0, 242, 254, 0.3)' : 'none',
                }}
              >
                {section.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ScrollProgress;
