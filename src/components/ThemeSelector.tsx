// src/components/ThemeSelector.tsx
import React from 'react';
import { useTheme, themes, ThemeName } from '@/utils/theme';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="theme-selector flex space-x-2 items-center mb-4">
      {Object.keys(themes).map((themeName) => (
        <button
          key={themeName}
          onClick={() => setTheme(themeName as ThemeName)}
          className={`w-8 h-8 rounded-full border border-black transition-all ${
            theme.name === themeName 
              ? 'ring-2 ring-black scale-110' 
              : 'hover:scale-105'
          }`}
          style={{ 
            background: themes[themeName as ThemeName].accentColor,
            borderColor: themes[themeName as ThemeName].borderColor
          }}
          aria-label={`${themeName} theme`}
          title={`${themeName} theme`}
        />
      ))}
      <span className="text-sm ml-2" style={{ color: theme.textColor }}>
        {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} theme
      </span>
    </div>
  );
};

export default ThemeSelector;