import React, { useState, useRef, useEffect } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      // Distance from mouse pointer to element center
      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Define range: half element size + padding
      const maxRange = Math.max(rect.width, rect.height) / 2 + padding;

      if (distance < maxRange) {
        setIsActive(true);
        // Apply magnetic pull divided by strength
        const pullX = distanceX / strength;
        const pullY = distanceY / strength;
        setPosition({ x: pullX, y: pullY });
      } else {
        if (isActive) {
          setIsActive(false);
          setPosition({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive, padding, strength]);

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isActive ? activeTransition : inactiveTransition,
    willChange: 'transform',
  };

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      <div style={style}>
        {children}
      </div>
    </div>
  );
};
export default Magnet;
