import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface AnimatedMarkdownProps {
  text: string;
  speed?: number; // ms por palavra
}

export const AnimatedMarkdown: React.FC<AnimatedMarkdownProps> = ({ text, speed = 40 }) => {
  const words = text ? text.split(' ') : [];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!text) return;
    const interval = setInterval(() => {
      setVisibleCount((count) => {
        if (count < words.length) return count + 1;
        clearInterval(interval);
        return count;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  // Monta o texto parcial para o ReactMarkdown
  const partialText = words.slice(0, visibleCount).join(' ');

  return (
    <div className="animated-markdown">
      <ReactMarkdown>{partialText}</ReactMarkdown>
      <style>{`
        .animated-markdown * {
          transition: opacity 0.3s;
        }
        .animated-markdown {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}; 