import React from 'react';

interface ThemeSelectorProps {
  onSelectTheme: (theme: string) => void;
  currentTheme?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelectTheme, currentTheme = 'clouds' }) => {
  const themes = ['clouds', 'waves', 'fog', 'birds', 'net', 'dots', 'rings']; // Added new themes from vantajs.com

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = event.target.value;
    onSelectTheme(theme);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme">Select Theme:</label>
      <select id="theme" value={currentTheme} onChange={handleChange}>
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector; 