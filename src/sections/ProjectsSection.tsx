import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton } from '../components/LiveProjectButton';

interface ProjectData {
  num: string;
  name: string;
  category: string;
  img1: string;
  img2: string;
  img3: string;
  liveUrl: string;
}

const projectsData: ProjectData[] = [
  {
    num: '01',
    name: 'Nextlevel Studio',
    category: 'Client',
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    liveUrl: '#',
  },
  {
    num: '02',
    name: 'Aura Brand Identity',
    category: 'Personal',
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    liveUrl: '#',
  },
  {
    num: '03',
    name: 'Solaris Digital',
    category: 'Client',
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    liveUrl: '#',
  },
];

interface StackingCardProps {
  project: ProjectData;
  index: number;
  totalCards: number;
}

const StackingCard: React.FC<StackingCardProps> = ({ project, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this sticky card element to apply scale reductions
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  // Animate from scale 1 down to targetScale as we scroll further
  const scale = useTransform(scrollYProgress, [0.8, 1], [1, targetScale]);

  // Responsive state for top sticky positioning offset
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stickyTop = isMobile ? (96 + index * 28) : (128 + index * 28);

  return (
    <div 
      ref={cardRef}
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex: index + 10,
      }}
      className="w-full flex justify-center items-start mb-24 md:mb-32 pointer-events-auto"
    >
      <motion.div
        style={{
          scale,
        }}
        className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] lg:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 md:gap-8 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
      >
        
        {/* Top Row inside Card */}
        <div className="flex justify-between items-center w-full select-none">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {/* Number */}
            <span 
              style={{ fontSize: 'clamp(2.5rem, 6vw, 90px)' }}
              className="font-black leading-none text-[#D7E2EA] select-none"
            >
              {project.num}
            </span>
            
            {/* Category and Project Name */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-light uppercase tracking-wider text-[#D7E2EA]/60">
                {project.category}
              </span>
              <h3 
                style={{ fontSize: 'clamp(1rem, 2.5vw, 2.5rem)' }}
                className="font-medium uppercase text-[#D7E2EA] leading-tight"
              >
                {project.name}
              </h3>
            </div>
          </div>

          {/* Live Project Button */}
          <LiveProjectButton href={project.liveUrl} />
        </div>

        {/* Bottom Row - Two Column Grid */}
        <div className="w-full flex-grow grid grid-cols-1 md:grid-cols-[4fr_6fr] gap-4 sm:gap-6 md:gap-8 overflow-hidden select-none">
          
          {/* Left Column (40% width on md+) */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full justify-between">
            {/* Top Image */}
            <div 
              style={{ height: 'clamp(110px, 15vw, 230px)' }}
              className="w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
            >
              <img 
                src={project.img1} 
                alt={`${project.name} preview 1`}
                className="w-full h-full object-cover filter brightness-90 hover:brightness-100 hover:scale-[1.03] transition-all duration-500"
                loading="lazy"
              />
            </div>
            
            {/* Bottom Image */}
            <div 
              style={{ height: 'clamp(140px, 20vw, 340px)' }}
              className="w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
            >
              <img 
                src={project.img2} 
                alt={`${project.name} preview 2`}
                className="w-full h-full object-cover filter brightness-90 hover:brightness-100 hover:scale-[1.03] transition-all duration-500"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column (60% width on md+) - 1 Tall Image */}
          <div className="w-full h-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]">
            <img 
              src={project.img3} 
              alt={`${project.name} main showcase`}
              className="w-full h-full object-cover filter brightness-90 hover:brightness-100 hover:scale-[1.03] transition-all duration-500"
              loading="lazy"
            />
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  return (
    <section 
      id="projects" 
      className="relative w-full bg-transparent rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 sm:pt-28 md:pt-36 pb-32 px-5 sm:px-8 md:px-10 z-30 overflow-visible select-none"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16 sm:mb-24 md:mb-32">
          <FadeIn delay={0} y={40} duration={0.8}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
              Project
            </h2>
          </FadeIn>
        </div>

        {/* Sticky-Stacking Cards Sibling Deck */}
        <div className="flex flex-col w-full relative z-10 overflow-visible">
          {projectsData.map((project, idx) => (
            <StackingCard 
              key={project.num}
              project={project}
              index={idx}
              totalCards={projectsData.length}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
