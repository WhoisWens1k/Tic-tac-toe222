import React, { useState } from 'react';

interface ThemeSelectorProps {
  onSelectTheme: (theme: string) => void;
  currentTheme?: string;
}

interface ThemeOption {
  id: string;
  name: string;
  previewColor: string;
  description: string;
}

const themeOptions: ThemeOption[] = [
  { 
    id: 'clouds', 
    name: 'Clouds', 
    previewColor: '#1a365d',
    description: 'Floating clouds in a blue sky'
  },
  { 
    id: 'waves', 
    name: 'Waves', 
    previewColor: '#0a2e44',
    description: 'Ocean waves with a deep blue background'
  },
  { 
    id: 'fog', 
    name: 'Fog', 
    previewColor: '#2c3e50',
    description: 'Mysterious fog effect'
  },
  { 
    id: 'birds', 
    name: 'Birds', 
    previewColor: '#0a192f',
    description: 'Flying birds animation'
  },
  { 
    id: 'net', 
    name: 'Network', 
    previewColor: '#0a192f',
    description: 'Connected network nodes'
  },
  { 
    id: 'dots', 
    name: 'Dots', 
    previewColor: '#0a192f',
    description: 'Animated dots pattern'
  },
  { 
    id: 'rings', 
    name: 'Rings', 
    previewColor: '#0a192f',
    description: 'Circular rings animation'
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelectTheme, currentTheme = 'clouds' }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ThemeOption | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = event.target.value;
    onSelectTheme(theme);
  };

  const handleMouseEnter = (theme: ThemeOption) => {
    setPreviewTheme(theme);
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
    setPreviewTheme(null);
  };

  return (
    <div className="theme-selector-container">
      <div className="theme-selector">
        <label htmlFor="theme">Select Theme:</label>
        <select id="theme" value={currentTheme} onChange={handleChange}>
          {themeOptions.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="theme-preview-grid">
        {themeOptions.map((theme) => (
          <div 
            key={theme.id}
            className={`theme-preview-item ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => onSelectTheme(theme.id)}
            onMouseEnter={() => handleMouseEnter(theme)}
            onMouseLeave={handleMouseLeave}
            style={{ backgroundColor: theme.previewColor }}
          >
            <span>{theme.name}</span>
          </div>
        ))}
      </div>
      
      {showPreview && previewTheme && (
        <div className="theme-tooltip" style={{ backgroundColor: previewTheme.previewColor }}>
          <h4>{previewTheme.name}</h4>
          <p>{previewTheme.description}</p>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 