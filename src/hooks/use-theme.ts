import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Function to check if user prefers dark mode
    const checkTheme = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      
      // Update favicon based on theme
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      
      // If favicon doesn't exist, create it
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        document.head.appendChild(favicon);
      }
      
      favicon.href = prefersDark ? '/faviconBranco.svg' : '/faviconAzul.svg';
    };

    // Check theme on mount
    checkTheme();

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkTheme();
    
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { isDark };
};
