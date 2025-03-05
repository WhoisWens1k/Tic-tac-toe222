import React, { useState, useCallback, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import AvatarSelection from './components/AvatarSelection';
import { useGameLogic } from './game/useGameLogic';
import { avatarImages } from './utils/avatarImages';
import './game-styles.css';

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

  const handleImageError = useCallback((imagePath: string) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [imagePath]: true
    }));
  }, []);

  const getAvatarFallback = useCallback((avatarPath: string | null) => {
    if (!avatarPath) return 'Avatar';
    return avatarFallbacks[avatarPath] || 'Avatar';
  }, []);

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
    resetGame();
  }, [resetGame]);

  const handleBackToHome = useCallback(() => {
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

  if (!player1Avatar || !player2Avatar) {
    return (
      <AvatarSelection
        onSelect={(p1Avatar, p2Avatar) => {
          setPlayer1Avatar(p1Avatar);
          setPlayer2Avatar(p2Avatar);
          startGame(null, "medium");
        }}
        onSelectTheme={handleThemeChange}
        currentTheme={currentTheme}
      />
    );
  }

  return (
    <div className={`app ${isThemeChanging ? 'theme-changing' : ''}`}>
      <div className="game-container">
        <div className="header-container">
          <h1>Modern Tic Tac Toe</h1>
          <ScoreBoard
            player1Icon={player1Avatar}
            player2Icon={player2Avatar}
            scores={{ PLAYER_ONE: scores[1], PLAYER_TWO: scores[2] }}
            imageLoadErrors={imageLoadErrors}
            onImageError={handleImageError}
          />
        </div>
        <div className="game-info">
          <div className="player-turn">
            Current Player: 
            <div className="avatar-display">
              {imageLoadErrors[gameState.currentPlayer === 1 ? player1Avatar : player2Avatar] ? (
                <div className="avatar-fallback">
                  {getAvatarFallback(gameState.currentPlayer === 1 ? player1Avatar : player2Avatar)}
                </div>
              ) : (
                <img 
                  src={gameState.currentPlayer === 1 ? player1Avatar : player2Avatar} 
                  alt={`Player ${gameState.currentPlayer}`} 
                  className="avatar-image"
                  onError={() => handleImageError(gameState.currentPlayer === 1 ? player1Avatar : player2Avatar)}
                />
              )}
            </div>
          </div>
          <div className="game-phase">
            {gameState.phase === 'placement' ? 'Placement Phase' : 'Movement Phase'}
          </div>
          {gameState.winner && (
            <div className="winner">
              Winner: 
              <div className="avatar-display">
                {imageLoadErrors[gameState.winner === 1 ? player1Avatar : player2Avatar] ? (
                  <div className="avatar-fallback">
                    {getAvatarFallback(gameState.winner === 1 ? player1Avatar : player2Avatar)}
                  </div>
                ) : (
                  <img 
                    src={gameState.winner === 1 ? player1Avatar : player2Avatar} 
                    alt={`Player ${gameState.winner}`} 
                    className="avatar-image"
                    onError={() => handleImageError(gameState.winner === 1 ? player1Avatar : player2Avatar)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Loading overlay */}
        {isThemeChanging && (
          <div className="theme-loading-overlay">
            <div className="loading-spinner"></div>
            <p>Changing theme...</p>
          </div>
        )}
        
        <GameBoard
          key={key} // Force re-render when theme changes
          board={gameState.board}
          currentPlayer={gameState.currentPlayer}
          selectedPosition={gameState.selectedPiece}
          winningLine={gameState.winningLine}
          player1Icon={player1Avatar}
          player2Icon={player2Avatar}
          onPositionClick={handlePosition}
          gamePhase={gameState.phase}
          imageLoadErrors={imageLoadErrors}
          onImageError={handleImageError}
          theme={currentTheme}
        />
        <div className="controls">
          <button onClick={handleResetGame} disabled={isThemeChanging}>New Game</button>
          <button onClick={handleBackToHome} disabled={isThemeChanging}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default App; 