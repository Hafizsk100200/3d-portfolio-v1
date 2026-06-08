import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharacterProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0 select-none">
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'start 0.4'],
  });

  const words = text.split(" ");
  const totalChars = text.length;
  let globalCharCount = 0;

  return (
    <p ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split("");
        
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const currentGlobalIndex = globalCharCount;
              globalCharCount++;
              
              // We increment for the space that follows this word if not the last one
              if (charIdx === wordChars.length - 1 && wordIdx < words.length - 1) {
                globalCharCount++;
              }

              const start = currentGlobalIndex / totalChars;
              const end = Math.min(1, (currentGlobalIndex + 4) / totalChars); // minor overlap for smoothness

              return (
                <Character
                  key={charIdx}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
            {wordIdx < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
      })}
    </p>
  );
};

export default AnimatedText;
