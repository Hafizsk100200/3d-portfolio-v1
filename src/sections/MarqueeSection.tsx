import React, { useEffect, useRef } from 'react';

const row1Images = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
];

const row2Images = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

// Tripled lists for seamless scroll wrapping
const row1Tripled = [...row1Images, ...row1Images, ...row1Images];
const row2Tripled = [...row2Images, ...row2Images, ...row2Images];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const target = sectionRef.current;
      const sectionTop = target.offsetTop;
      const windowHeight = window.innerHeight;

      // Scroll offset logic as specified: (scrollY - sectionTop + window.innerHeight) * 0.3
      const scrollOffset = (window.scrollY - sectionTop + windowHeight) * 0.3;

      // Row 1 moves right: translateX(offset - 200)
      if (row1Ref.current) {
        row1Ref.current.style.transform = `translate3d(${scrollOffset - 200}px, 0, 0)`;
      }

      // Row 2 moves left: translateX(-(offset - 200))
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translate3d(${-(scrollOffset - 200)}px, 0, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Trigger initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-transparent pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 z-20 relative select-none"
    >
      {/* Row 1 - Moves Right */}
      <div className="w-full flex overflow-hidden">
        <div 
          ref={row1Ref}
          className="flex gap-3 will-change-transform"
          style={{ willChange: 'transform' }}
        >
          {row1Tripled.map((url, index) => (
            <img
              key={`row1-${index}`}
              src={url}
              alt={`Design Showcase ${index + 1}`}
              className="w-[420px] h-[270px] flex-shrink-0 rounded-2xl object-cover shadow-2xl filter brightness-90 hover:brightness-100 transition-all duration-300 pointer-events-none"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* Row 2 - Moves Left */}
      <div className="w-full flex overflow-hidden">
        <div 
          ref={row2Ref}
          className="flex gap-3 will-change-transform"
          style={{ willChange: 'transform' }}
        >
          {row2Tripled.map((url, index) => (
            <img
              key={`row2-${index}`}
              src={url}
              alt={`Design Showcase ${index + 1}`}
              className="w-[420px] h-[270px] flex-shrink-0 rounded-2xl object-cover shadow-2xl filter brightness-90 hover:brightness-100 transition-all duration-300 pointer-events-none"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
