import React from 'react';

interface LiveProjectButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  href = '#',
  onClick,
  className = '',
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      target={href !== '#' ? "_blank" : undefined}
      rel={href !== '#' ? "noopener noreferrer" : undefined}
      className={`
        inline-flex items-center justify-center
        rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA]
        font-medium uppercase tracking-widest
        px-8 py-3 sm:px-10 sm:py-3.5
        text-xs sm:text-sm
        transition-colors duration-200
        hover:bg-[#D7E2EA]/10 active:scale-[0.98]
        cursor-pointer text-center
        ${className}
      `}
    >
      Live Project
    </a>
  );
};

export default LiveProjectButton;
