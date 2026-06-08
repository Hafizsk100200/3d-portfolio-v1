import React, { useEffect, useState, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import heroPortrait from '../assets/hero_portrait.png';

interface LoadingScreenProps {
  onFinished?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const { progress: threeProgress } = useProgress();
  const [imagesProgress, setImagesProgress] = useState(0);
  const [fontsProgress, setFontsProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  
  // States for reveal and vanish
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealComplete, setIsRevealComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // References for layout measurements
  const logoRef = useRef<HTMLSpanElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);

  const [flipTransform, setFlipTransform] = useState<string>('');
  const [flipTransition, setFlipTransition] = useState<string>('none');
  const totalWidthRef = useRef<number>(0);

  // Contiguous characters for "Hi, i'm Hafiz" (with natural space characters)
  const chars = ["H", "i", ",", "\u00A0", "i", "'", "m", "\u00A0", "H", "a", "f", "i", "z"];

  // 1. Font loading detector
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready
        .then(() => {
          setFontsProgress(100);
        })
        .catch((err) => {
          console.warn('Font loading check failed, continuing:', err);
          setFontsProgress(100);
        });
    } else {
      setFontsProgress(100);
    }
  }, []);

  // 2. Preload all site images and track progress
  useEffect(() => {
    const imageUrls = [
      heroPortrait,
      // 3D floating decorations (Figma web assets)
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
      'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
      // Projects section showcase cards (Higgs webp/png assets)
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85'
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    if (totalImages === 0) {
      setImagesProgress(100);
      return;
    }

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      
      const handleLoad = () => {
        loadedCount++;
        setImagesProgress(Math.round((loadedCount / totalImages) * 100));
      };

      img.onload = handleLoad;
      img.onerror = handleLoad; 
    });
  }, []);

  // Safety timeout: if loading takes more than 12 seconds, force completion
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      setImagesProgress(100);
      setFontsProgress(100);
    }, 12000);
    return () => clearTimeout(safetyTimeout);
  }, []);

  // 3. Compute combined progress (50% 3D model, 40% images, 10% web fonts)
  const actualTargetProgress = Math.round(
    (threeProgress * 0.5) + (imagesProgress * 0.4) + (fontsProgress * 0.1)
  );

  // 3. Smoothly interpolate display progress to avoid jumps
  useEffect(() => {
    let animationFrameId: number;

    const updateDisplayProgress = () => {
      setDisplayProgress((prev) => {
        if (prev < actualTargetProgress) {
          const diff = actualTargetProgress - prev;
          const step = Math.max(0.4, diff * 0.08);
          const next = Math.min(actualTargetProgress, prev + step);
          return next;
        }
        return prev;
      });
      animationFrameId = requestAnimationFrame(updateDisplayProgress);
    };

    updateDisplayProgress();
    return () => cancelAnimationFrame(animationFrameId);
  }, [actualTargetProgress]);

  // 4. Measuring name width for scaling calculations
  const updateLayoutMeasurements = () => {
    if (nameWrapperRef.current) {
      totalWidthRef.current = nameWrapperRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    updateLayoutMeasurements();
    const t1 = setTimeout(updateLayoutMeasurements, 100);
    const t2 = setTimeout(updateLayoutMeasurements, 500);
    window.addEventListener('resize', updateLayoutMeasurements);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updateLayoutMeasurements);
    };
  }, [isRevealed]);

  // 5. Reveal trigger timeline (snappy, tighter timings)
  useEffect(() => {
    const t1 = setTimeout(() => {
      setIsRevealed(true);
    }, 150);

    const t2 = setTimeout(() => {
      setIsRevealComplete(true);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 6. Trigger name slide up followed by fade out when 100% loaded
  useEffect(() => {
    if (Math.round(displayProgress) >= 100 && isRevealComplete) {
      const startTransitionTimeout = setTimeout(() => {
        // Step 1: Fire onFinished so the hero title starts becoming visible underneath
        if (onFinished) {
          onFinished();
        }

        // Step 2: Slide name upwards — double-rAF ensures paint before transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const targetEl = document.getElementById('hero-title-target');
            if (targetEl && nameWrapperRef.current) {
              const targetRect = targetEl.getBoundingClientRect();
              const targetCenterX = targetRect.left + targetRect.width / 2;
              const targetCenterY = targetRect.top + targetRect.height / 2;
              const layoutCenterX = window.innerWidth / 2;
              const layoutCenterY = window.innerHeight / 2;
              const deltaX = targetCenterX - layoutCenterX;
              const deltaY = targetCenterY - layoutCenterY;
              const scale = targetRect.width / totalWidthRef.current;

              setFlipTransition('transform 650ms cubic-bezier(0.16, 1, 0.3, 1)');
              setFlipTransform(`translate(${deltaX}px, ${deltaY}px) scale(${scale})`);
            }
          });
        });

        // Step 3: After slide-up completes, fade out
        const fadeOutTimeout = setTimeout(() => {
          setIsFadingOut(true);
          const unmountTimeout = setTimeout(() => {
            setIsMounted(false);
          }, 500);
          return () => clearTimeout(unmountTimeout);
        }, 700);

        return () => clearTimeout(fadeOutTimeout);
      }, 200);

      return () => clearTimeout(startTransitionTimeout);
    }
  }, [displayProgress, isRevealComplete, onFinished]);

  if (!isMounted) return null;

  // Stagger layout helper based on distance to center
  const getStaggerDelay = (idx: number) => {
    const distance = Math.abs(idx - 6.0);
    return `${distance * 25}ms`;
  };

  // Track whether to show secondary elements (after name reveal, before slide)
  const isTransitioning = !!flipTransform;
  const showExtras = isRevealed && !isTransitioning && !isFadingOut;
  const roundedProgress = Math.round(displayProgress);

  const loadingSteps = [
    { label: 'Initializing 3D WebGL Engine', target: 20 },
    { label: 'Loading 3D Models & Geometry', target: 50 },
    { label: 'Preloading High-Res Textures', target: 75 },
    { label: 'Optimizing Physics & Lights', target: 95 },
  ];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden bg-transparent">
      
      {/* 1. Base Dark Background Overlay */}
      <div 
        className={`absolute inset-0 bg-[#0C0C0C] transition-opacity duration-[500ms] ease-in-out pointer-events-auto ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 2. Corner decorative markers */}
      {/* Top-left */}
      <div 
        className="absolute top-6 left-6 md:top-8 md:left-10 transition-all duration-500 ease-out"
        style={{ opacity: showExtras ? 0.4 : 0, transform: showExtras ? 'translate(0,0)' : 'translate(-10px,-10px)' }}
      >
        <div className="w-5 h-5 border-l border-t border-[#D7E2EA]/30" />
      </div>
      {/* Top-right */}
      <div 
        className="absolute top-6 right-6 md:top-8 md:right-10 transition-all duration-500 ease-out"
        style={{ opacity: showExtras ? 0.4 : 0, transform: showExtras ? 'translate(0,0)' : 'translate(10px,-10px)' }}
      >
        <div className="w-5 h-5 border-r border-t border-[#D7E2EA]/30" />
      </div>
      {/* Bottom-left */}
      <div 
        className="absolute bottom-6 left-6 md:bottom-8 md:left-10 transition-all duration-500 ease-out"
        style={{ opacity: showExtras ? 0.4 : 0, transform: showExtras ? 'translate(0,0)' : 'translate(-10px,10px)' }}
      >
        <div className="w-5 h-5 border-l border-b border-[#D7E2EA]/30" />
      </div>
      {/* Bottom-right */}
      <div 
        className="absolute bottom-6 right-6 md:bottom-8 md:right-10 transition-all duration-500 ease-out"
        style={{ opacity: showExtras ? 0.4 : 0, transform: showExtras ? 'translate(0,0)' : 'translate(10px,10px)' }}
      >
        <div className="w-5 h-5 border-r border-b border-[#D7E2EA]/30" />
      </div>

      {/* 3. Top-center year tag */}
      <div 
        className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
        style={{ opacity: showExtras ? 0.5 : 0, transform: `translateX(-50%) translateY(${showExtras ? '0' : '-15px'})` }}
      >
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/50 font-light">
          Portfolio &mdash; 2026
        </span>
      </div>

      {/* 4. Centered name reveal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Name */}
          <div 
            ref={nameWrapperRef}
            className="relative flex items-baseline justify-center"
            style={{
              transform: flipTransform || 'scale(1.0)',
              transition: `${flipTransition || 'none'}, opacity 500ms ease-in-out`,
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
              opacity: isFadingOut ? 0 : 1,
            }}
          >
            {chars.map((ch, i) => {
              const isLogo = i === 0;
              return (
                <div key={i} className="overflow-hidden inline-block leading-none">
                  <span
                    ref={isLogo ? logoRef : undefined}
                    className="inline-block hero-heading hero-title font-black text-[11vw] sm:text-[12vw] md:text-[13vw] lg:text-[14.5vw] uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#BBCCD7] to-[#646973] transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      fontFamily: "'Kanit', sans-serif",
                      transform: isRevealed ? 'translateY(0%)' : 'translateY(110%)',
                      opacity: isRevealed ? 1 : 0,
                      transitionDelay: getStaggerDelay(i),
                    }}
                  >
                    {ch === '\u00A0' ? '\u00A0' : ch}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Subtitle — appears below name, fades out before slide */}
          <div 
            className="mt-2 md:mt-4 overflow-hidden transition-all duration-500 ease-out"
            style={{ 
              opacity: showExtras ? 0.6 : 0, 
              transform: `translateY(${showExtras ? '0' : '20px'})`,
            }}
          >
            <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.35em] text-[#D7E2EA]/50 font-light text-center">
              Creative Developer &amp; 3D Artist
            </p>
          </div>

          {/* Staggered loading checklist */}
          <div 
            className="mt-6 sm:mt-8 flex flex-col gap-2.5 transition-all duration-500 ease-out min-w-[200px]"
            style={{ 
              opacity: showExtras ? 0.8 : 0, 
              transform: `translateY(${showExtras ? '0' : '20px'})`,
            }}
          >
            {loadingSteps.map((step, idx) => {
              const isCompleted = roundedProgress >= step.target;
              return (
                <div key={idx} className="flex items-center gap-3 text-left">
                  <div className="w-3.5 h-3.5 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center relative bg-black/40">
                    {isCompleted && (
                      <div className="absolute inset-0.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    isCompleted ? 'text-[#D7E2EA] font-semibold' : 'text-[#D7E2EA]/25 font-light'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Bottom progress section */}
      <div 
        className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-all duration-500 ease-out w-[200px] sm:w-[260px] md:w-[320px]"
        style={{ 
          opacity: showExtras ? 1 : 0, 
          transform: `translateX(-50%) translateY(${showExtras ? '0' : '20px'})`,
        }}
      >
        {/* Progress percentage */}
        <div className="flex items-baseline gap-1">
          <span 
            className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums text-[#D7E2EA]"
            style={{ 
              fontFamily: "'Kanit', sans-serif",
              textShadow: '0 0 10px rgba(215, 226, 234, 0.2)'
            }}
          >
            {roundedProgress}
          </span>
          <span className="text-xs md:text-sm text-[#00F2FE] font-black uppercase tracking-widest filter drop-shadow-[0_0_5px_rgba(0,242,254,0.4)]">%</span>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-[1px] bg-[#D7E2EA]/10 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${roundedProgress}%`,
              background: 'linear-gradient(90deg, #00F2FE, #4FACFE, #B600A8)',
              boxShadow: '0 0 12px rgba(0, 242, 254, 0.4)',
            }}
          />
        </div>

        {/* Loading label */}
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#D7E2EA]/25 font-light">
          Loading experience
        </span>
      </div>

    </div>
  );
};

export default LoadingScreen;
