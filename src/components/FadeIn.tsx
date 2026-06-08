import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: string;
  className?: string;
  animateOnMount?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
  animateOnMount,
}) => {
  // Using motion.create for dynamic element types
  const MotionComponent = (motion as any).create
    ? (motion as any).create(as)
    : (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      animate={animateOnMount ? { opacity: 1, x: 0, y: 0 } : undefined}
      whileInView={animateOnMount === undefined ? { opacity: 1, x: 0, y: 0 } : undefined}
      viewport={animateOnMount === undefined ? { once: true, margin: "50px", amount: 0 } : undefined}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};
