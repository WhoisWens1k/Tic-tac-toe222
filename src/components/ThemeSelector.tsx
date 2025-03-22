import React from 'react';
import { soundManager } from '../utils/soundEffects';
import { motion } from 'framer-motion';

interface ThemeSelectorProps {
  onSelectTheme: (theme: string) => void;
  currentTheme?: string;
}

interface ThemeOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  background: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'clouds',
    name: 'Clouds',
    icon: '☁️',
    description: 'Peaceful floating clouds',
    background: 'linear-gradient(to bottom, #4b6cb7, #182848)'
  },
  {
    id: 'waves',
    name: 'Waves',
    icon: '🌊',
    description: 'Gentle ocean waves',
    background: 'linear-gradient(to bottom, #00b4db, #0083b0)'
  },
  {
    id: 'fog',
    name: 'Fog',
    icon: '🌫️',
    description: 'Mysterious foggy atmosphere',
    background: 'linear-gradient(to bottom, #757f9a, #d7dde8)'
  },
  {
    id: 'birds',
    name: 'Birds',
    icon: '🐦',
    description: 'Flying bird patterns',
    background: 'linear-gradient(to bottom, #ff7e5f, #feb47b)'
  },
  {
    id: 'net',
    name: 'Network',
    icon: '🕸️',
    description: 'Connected network of lines',
    background: 'linear-gradient(to bottom, #5614b0, #dbd65c)'
  },
  {
    id: 'dots',
    name: 'Dots',
    icon: '⚫',
    description: 'Interactive particle dots',
    background: 'linear-gradient(to bottom, #3a1c71, #d76d77, #ffaf7b)'
  },
  {
    id: 'rings',
    name: 'Rings',
    icon: '⭕',
    description: 'Colorful circular rings',
    background: 'linear-gradient(to bottom, #bc4e9c, #f80759)'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelectTheme, currentTheme = 'clouds' }) => {
  const handleThemeSelect = (themeId: string) => {
    soundManager.play('click');
    onSelectTheme(themeId);
  };

  return (
    <div className="theme-selector">
      <motion.div 
        className="theme-options"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {themeOptions.map((theme) => (
          <motion.button
            key={theme.id}
            className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => handleThemeSelect(theme.id)}
            aria-label={`Select ${theme.name} theme`}
            title={theme.description}
            variants={item}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              overflow: 'hidden',
              position: 'relative' 
            }}
          >
            <div className="theme-preview" style={{ background: theme.background }}>
              <div className={`theme-effect ${theme.id}`}></div>
              <span className="theme-icon">{theme.icon}</span>
            </div>
            <span className="theme-name">{theme.name}</span>
            {currentTheme === theme.id && (
              <motion.div 
                className="theme-active-indicator"
                layoutId="activeThemeIndicator"
                initial={false}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default ThemeSelector; 