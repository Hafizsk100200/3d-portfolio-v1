import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/ContactButton';
import { Magnet } from '../components/Magnet';

export const AboutSection: React.FC = () => {
  // Soft float animation config for subtle 3D hover/idle movement
  const floatTransition = (duration: number, delay: number) => ({
    y: {
      duration: duration,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
      delay: delay,
    },
    rotate: {
      duration: duration * 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
      delay: delay * 0.5,
    }
  });

  return (
    <section 
      id="about" 
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-transparent py-20 px-5 sm:px-8 md:px-10 overflow-hidden text-center select-none z-20"
    >
      
      {/* 1. Corner Floating 3D Icons */}
      
      {/* Top-Left Moon */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-auto">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <motion.div 
            animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
            transition={floatTransition(4, 0.2)}
            className="w-[120px] sm:w-[160px] md:w-[210px]"
          >
            <Magnet padding={40} strength={5}>
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
                alt="Moon Icon"
                className="w-full object-contain pointer-events-none"
                loading="lazy"
              />
            </Magnet>
          </motion.div>
        </FadeIn>
      </div>

      {/* Bottom-Left 3D Object */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-auto">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
            transition={floatTransition(4.5, 0.5)}
            className="w-[100px] sm:w-[140px] md:w-[180px]"
          >
            <Magnet padding={40} strength={5}>
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
                alt="3D Spike Object"
                className="w-full object-contain pointer-events-none"
                loading="lazy"
              />
            </Magnet>
          </motion.div>
        </FadeIn>
      </div>

      {/* Top-Right Lego Icon */}
      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-auto">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -6, 0] }}
            transition={floatTransition(4.2, 0.3)}
            className="w-[120px] sm:w-[160px] md:w-[210px]"
          >
            <Magnet padding={40} strength={5}>
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
                alt="Lego Block"
                className="w-full object-contain pointer-events-none"
                loading="lazy"
              />
            </Magnet>
          </motion.div>
        </FadeIn>
      </div>

      {/* Bottom-Right 3D Group */}
      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-auto">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <motion.div
            animate={{ y: [0, 12, 0], rotate: [0, 8, 0] }}
            transition={floatTransition(4.8, 0.7)}
            className="w-[130px] sm:w-[170px] md:w-[220px]"
          >
            <Magnet padding={40} strength={5}>
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
                alt="3D Shapes Group"
                className="w-full object-contain pointer-events-none"
                loading="lazy"
              />
            </Magnet>
          </motion.div>
        </FadeIn>
      </div>

      {/* 2. Central Content Block */}
      <div className="flex flex-col items-center justify-center max-w-4xl z-0">
        
        {/* Heading */}
        <div className="mb-10 sm:mb-14 md:mb-16">
          <FadeIn delay={0} y={40} duration={0.8}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
              About me
            </h2>
          </FadeIn>
        </div>

        {/* Scroll Reveal Biography Paragraph */}
        <div className="mb-16 sm:mb-20 md:mb-24 px-4">
          <AnimatedText
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium leading-relaxed max-w-[560px] mx-auto text-base sm:text-lg md:text-[1.35rem]"
          />
        </div>

        {/* Contact Button */}
        <FadeIn delay={0.1} y={30} duration={0.8}>
          <Magnet padding={40} strength={4}>
            <ContactButton />
          </Magnet>
        </FadeIn>

      </div>

    </section>
  );
};

export default AboutSection;
