import React, { useState, useCallback, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import AvatarSelection from './components/AvatarSelection';
import BackgroundStars from './components/BackgroundStars';
import SettingsButton from './components/SettingsButton';
import Settings from './components/Settings';
import VolumeControl from './components/VolumeControl';
import { useGameLogic } from './game/useGameLogic';
import { avatarImages } from './utils/avatarImages';
import { soundManager } from './utils/soundEffects';
import './game-styles.css';
import './App.css';

// Fallback mapping for avatars
const avatarFallbacks: Record<string, string> = {
  [avatarImages.avatar1]: 'Avatar 1',
  [avatarImages.avatar2]: 'Avatar 2',
  [avatarImages.avatar3]: 'Avatar 3'
};

// Default theme
const DEFAULT_THEME = 'clouds';

// Available themes
const AVAILABLE_THEMES = ['clouds', 'waves', 'fog', 'birds', 'net', 'dots', 'rings'];

const App: React.FC = () => {
  const [player1Avatar, setPlayer1Avatar] = useState<string | null>(null);
  const [player2Avatar, setPlayer2Avatar] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [key, setKey] = useState(0); // Key to force re-render of GameBoard when theme changes
  const [showSettings, setShowSettings] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.5);

  const { gameState, handlePosition, resetGame, startGame } = useGameLogic();

  // Preload theme scripts
  useEffect(() => {
    // This helps ensure the scripts are loaded before they're needed
    const preloadScript = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      document.head.appendChild(link);
    };

    // Preload Three.js
    preloadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js');
    
    // Preload Vanta effects
    AVAILABLE_THEMES.forEach(theme => {
      preloadScript(`https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${theme}.min.js`);
    });
  }, []);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setVolume(soundVolume);
  }, [soundVolume]);

  const handleImageError = useCallback((imagePath: string) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [imagePath]: true
    }));
  }, []);

  const getAvatarFallback = (imagePath: string): string => {
    return avatarFallbacks[imagePath] || 'P';
  };

  const handleThemeChange = useCallback((theme: string) => {
    // Set loading state
    setIsThemeChanging(true);
    
    // Change theme with a slight delay to allow for transition effects
    setTimeout(() => {
      setCurrentTheme(theme);
      // Force re-render of GameBoard when theme changes
      setKey(prevKey => prevKey + 1);
      
      // Reset loading state after a delay to ensure the theme has loaded
      setTimeout(() => {
        setIsThemeChanging(false);
      }, 500);
    }, 100);
  }, []);

  // Update scores when there's a winner
  useEffect(() => {
    if (gameState.winner) {
      setScores(prev => ({
        ...prev,
        [gameState.winner as keyof typeof prev]: prev[gameState.winner as keyof typeof prev] + 1
      }));
    }
  }, [gameState.winner]);

  const handleResetGame = useCallback(() => {
    soundManager.play('click');
    resetGame();
  }, [resetGame]);

  const handleBackToHome = useCallback(() => {
    soundManager.play('click');
    // Set loading state
    setIsThemeChanging(true);
    
    setTimeout(() => {
      setPlayer1Avatar(null);
      setPlayer2Avatar(null);
      resetGame();
      // Reset scores when going back to home
      setScores({ 1: 0, 2: 0 });
      
      // Reset loading state
      setIsThemeChanging(false);
    }, 300);
  }, [resetGame]);

  const handleAvatarSelect = useCallback((p1Avatar: string, p2Avatar: string) => {
    soundManager.play('select');
    setPlayer1Avatar(p1Avatar);
    setPlayer2Avatar(p2Avatar);
    startGame(null, "medium");
  }, [startGame]);

  const handleThemeSelect = useCallback(() => {
    soundManager.play('click');
    handleThemeChange(AVAILABLE_THEMES[Math.floor(Math.random() * AVAILABLE_THEMES.length)]);
  }, [handleThemeChange]);

  const handleNewGame = useCallback(() => {
    handleBackToHome();
  }, [handleBackToHome]);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleVolumeChange = useCallback((volume: number) => {
    setSoundVolume(volume);
    soundManager.setVolume(volume);
  }, []);

  if (!player1Avatar || !player2Avatar) {
    return (
      <div className={`app-container ${isThemeChanging ? 'theme-changing' : ''}`}>
        <BackgroundStars />
        <div className="settings-corner">
          <SettingsButton 
            onClick={toggleSettings} 
            className="settings-button-top-right"
          />
        </div>
        <AvatarSelection
          onSelect={handleAvatarSelect}
          onSelectTheme={handleThemeSelect}
          currentTheme={currentTheme}
        />
        {showSettings && (
          <Settings 
            onClose={closeSettings}
            onSelectTheme={handleThemeChange}
            currentTheme={currentTheme}
            soundVolume={soundVolume}
            onVolumeChange={handleVolumeChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`app-container ${isThemeChanging ? 'theme-changing' : ''}`}>
      <BackgroundStars />
      <div className="settings-corner">
        <SettingsButton 
          onClick={toggleSettings} 
          className="settings-button-top-right"
        />
      </div>
      <div className="game-container">
        <ScoreBoard
          player1Icon={player1Avatar}
          player2Icon={player2Avatar}
          scores={{ PLAYER_ONE: scores[1], PLAYER_TWO: scores[2] }}
          imageLoadErrors={imageLoadErrors}
          onImageError={handleImageError}
        />
        
        <GameBoard
          key={key}
          board={gameState.board}
          currentPlayer={gameState.currentPlayer}
          selectedPosition={gameState.selectedPiece}
          winningLine={gameState.winningLine}
          gamePhase={gameState.phase}
          onPositionClick={handlePosition}
          player1Icon={player1Avatar}
          player2Icon={player2Avatar}
          imageLoadErrors={imageLoadErrors}
          onImageError={handleImageError}
          theme={currentTheme}
        />
        
        <div className="controls">
          <button onClick={handleResetGame}>New Game</button>
          <button onClick={handleThemeSelect}>Change Theme</button>
          <button onClick={handleNewGame}>Change Avatars</button>
        </div>
      </div>
      
      {showSettings && (
        <Settings 
          onClose={closeSettings}
          onSelectTheme={handleThemeChange}
          currentTheme={currentTheme}
          soundVolume={soundVolume}
          onVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export default App; 