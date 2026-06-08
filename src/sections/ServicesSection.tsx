import React from 'react';
import { FadeIn } from '../components/FadeIn';

interface ServiceItem {
  num: string;
  title: string;
  description: string;
}

const servicesData: ServiceItem[] = [
  {
    num: '01',
    title: '3D Modeling',
    description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    num: '02',
    title: 'Rendering',
    description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    num: '03',
    title: 'Motion Design',
    description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    num: '04',
    title: 'Branding',
    description: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    num: '05',
    title: 'Web Design',
    description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

export const ServicesSection: React.FC = () => {
  // Distribute the premium 3D assets to represent each hovered category
  const getServiceIcon = (index: number) => {
    const icons = [
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png', // 3D pointer block shapes
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png', // Crescent face moon
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png', // 3D shapes group
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png', // 3D spike element
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png', // Lego brick
    ];
    return icons[index] || icons[0];
  };

  return (
    <section 
      id="services" 
      className="relative w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 select-none text-[#0C0C0C]"
    >
      {/* White background layer behind the 3D canvas (global z-index 10) */}
      <div 
        className="absolute inset-0 bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] pointer-events-none" 
        style={{ zIndex: 10 }}
      />

      <div className="relative max-w-5xl mx-auto" style={{ zIndex: 20 }}>
        
        {/* Section Heading */}
        <div className="text-center mb-16 sm:mb-20 md:mb-28">
          <FadeIn delay={0} y={40} duration={0.8}>
            <h2 className="font-black uppercase leading-none tracking-tight text-[#0C0C0C] text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
              Services
            </h2>
          </FadeIn>
        </div>

        {/* Services List */}
        <div className="flex flex-col w-full border-t border-[rgba(12,12,12,0.15)]">
          {servicesData.map((item, index) => (
            <FadeIn 
              key={item.num}
              delay={index * 0.1}
              y={30}
              duration={0.8}
              className="w-full"
            >
              <div 
                className="group flex items-center gap-6 sm:gap-12 md:gap-20 py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] hover:bg-[#0c0c0c]/5 transition-colors duration-300 px-2 sm:px-4 cursor-pointer relative"
              >
                
                {/* Left side: Huge Index Number */}
                <span 
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                  className="font-black leading-none select-none min-w-[2.5ch] text-[#0C0C0C] group-hover:text-[#B600A8] transition-colors duration-300"
                >
                  {item.num}
                </span>

                {/* Right side: Name + Description stacked */}
                <div className="flex flex-col flex-grow select-none relative z-10 items-start">
                  <div className="relative inline-flex items-center">
                    <h3 
                      style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                      className="font-semibold uppercase text-[#0C0C0C] group-hover:text-[#B600A8] transition-colors duration-300 leading-snug"
                    >
                      {item.title}
                    </h3>

                    {/* Pop-in & Floating 3D graphics on hover - positioned AFTER the heading to eliminate any layout shifts or flickering */}
                    <img
                      src={getServiceIcon(index)}
                      alt={`${item.title} icon`}
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-3 sm:ml-5 w-10 h-10 sm:w-14 sm:h-14 object-contain pointer-events-none select-none opacity-0 scale-50 translate-x-[-15px] rotate-[-25deg] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-hover:rotate-0 transition-all duration-300 ease-out z-30"
                    />
                  </div>
                  <p 
                    style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                    className="font-light leading-relaxed text-[#0C0C0C]/60 group-hover:text-[#0C0C0C]/80 transition-colors duration-300 max-w-2xl mt-2"
                  >
                    {item.description}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
