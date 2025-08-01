"use client";

import { useEffect, useState } from "react";
import { TextRoll } from "./text-roll";

export const AnimatedCarousel = ({
  title = "Trusted by thousands of businesses worldwide",
  logoCount = 15,
  autoPlay = true,
  autoPlayInterval = 1000,
  logos = null, // Array of image URLs
  containerClassName = "",
  titleClassName = "",
  carouselClassName = "",
  logoClassName = "",
  itemsPerViewMobile = 4,
  itemsPerViewDesktop = 6,
  spacing = "gap-10",
  padding = "py-20 lg:py-40",
  logoContainerWidth = "w-48",
  logoContainerHeight = "h-24",
  logoImageWidth = "w-full",
  logoImageHeight = "h-full",
  logoMaxWidth = "",
  logoMaxHeight = "",
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setScrollPosition(prev => {
        // Calcular a largura aproximada de um logo + gap
        const logoWidth = 128; // w-32 = 128px
        const gap = 32; // gap-8 = 32px
        const totalWidth = logoWidth + gap;
        
        // Reset quando chegar ao final do primeiro conjunto de logos
        if (prev >= totalWidth * (logos?.length || logoCount)) {
          return 0;
        }
        
        return prev + 0.5; // Movimento mais suave
      });
    }, 16.67); // 60fps (1000ms / 60 = 16.67ms)

    return () => clearInterval(interval);
  }, [autoPlay, logos, logoCount]);

  const logoItems = logos || Array.from({ length: logoCount }, (_, i) => `https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=100&q=80&text=Logo+${i+1}`);

  const logoImageSizeClasses = `${logoImageWidth} ${logoImageHeight} ${logoMaxWidth} ${logoMaxHeight}`.trim();

  // Duplicar os logos para criar o efeito infinito
  const duplicatedLogos = [...logoItems, ...logoItems];

  return (
    <div className={`w-full ${padding} bg-background ${containerClassName}`}>
      <div className="container mx-auto">
        <div className={`flex flex-col ${spacing}`}>
          <h2 className={`text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left ml-2 text-foreground ${titleClassName}`}>
            <TextRoll>{title}</TextRoll>
          </h2>
          <div className="overflow-hidden relative">
            {/* Gradiente esquerdo */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            {/* Gradiente direito */}
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            <div 
              className="flex gap-8 items-center"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
                transition: 'transform 0.03s linear'
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div 
                  key={index}
                  className={`flex-shrink-0 ${logoContainerWidth} ${logoContainerHeight} flex items-center justify-center p-4 hover:bg-accent rounded-lg transition-colors ${logoClassName}`}
                >
                  <img 
                    src={typeof logo === 'string' ? logo : logo}
                    alt={`Logo ${index + 1}`}
                    className={`${logoImageSizeClasses} object-contain ${logos ? '' : 'filter brightness-0 dark:brightness-0 dark:invert'}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Case1 = (props) => {
  return <AnimatedCarousel {...props} />;
}; 