import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import AvatarSelection from './components/AvatarSelection';
import { useGameLogic } from './hooks/useGameLogic';
import { Player } from './types/game';
import { avatarImages } from './utils/avatarImages';

// Fallback mapping for avatars
const avatarFallbacks: Record<string, string> = {
  [avatarImages.avatar1]: 'Avatar 1',
  [avatarImages.avatar2]: 'Avatar 2',
  [avatarImages.avatar3]: 'Avatar 3'
};

const App: React.FC = () => {
  const [player1Avatar, setPlayer1Avatar] = useState<string | null>(null);
  const [player2Avatar, setPlayer2Avatar] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  const {
    board,
    currentPlayer,
    selectedPosition,
    gamePhase,
    winner,
    winningLine,
    scores,
    handlePositionClick,
    resetGame,
  } = useGameLogic();

  const handleImageError = (imagePath: string) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [imagePath]: true
    }));
  };

  const getAvatarFallback = (avatarPath: string | null) => {
    if (!avatarPath) return 'Avatar';
    return avatarFallbacks[avatarPath] || 'Avatar';
  };

  if (!player1Avatar || !player2Avatar) {
    return (
      <AvatarSelection
        onSelect={(p1Avatar, p2Avatar) => {
          setPlayer1Avatar(p1Avatar);
          setPlayer2Avatar(p2Avatar);
        }}
      />
    );
  }

  return (
    <div className="app">
      <div className="game-container">
        <h1>Modern Tic Tac Toe</h1>
        <div className="game-info">
          <div className="player-turn">
            Current Player: 
            <div className="avatar-display">
              {imageLoadErrors[currentPlayer === Player.One ? player1Avatar : player2Avatar] ? (
                <div className="avatar-fallback">
                  {getAvatarFallback(currentPlayer === Player.One ? player1Avatar : player2Avatar)}
                </div>
              ) : (
                <img 
                  src={currentPlayer === Player.One ? player1Avatar : player2Avatar} 
                  alt={`Player ${currentPlayer}`} 
                  className="avatar-image"
                  onError={() => handleImageError(currentPlayer === Player.One ? player1Avatar : player2Avatar)}
                />
              )}
            </div>
          </div>
          <div className="game-phase">
            {gamePhase === 'placement' ? 'Placement Phase' : 'Movement Phase'}
          </div>
          {winner && (
            <div className="winner">
              Winner: 
              <div className="avatar-display">
                {imageLoadErrors[winner === Player.One ? player1Avatar : player2Avatar] ? (
                  <div className="avatar-fallback">
                    {getAvatarFallback(winner === Player.One ? player1Avatar : player2Avatar)}
                  </div>
                ) : (
                  <img 
                    src={winner === Player.One ? player1Avatar : player2Avatar} 
                    alt={`Player ${winner}`} 
                    className="avatar-image"
                    onError={() => handleImageError(winner === Player.One ? player1Avatar : player2Avatar)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <GameBoard
          board={board}
          currentPlayer={currentPlayer}
          selectedPosition={selectedPosition}
          winningLine={winningLine}
          player1Icon={player1Avatar}
          player2Icon={player2Avatar}
          onPositionClick={handlePositionClick}
          gamePhase={gamePhase}
          imageLoadErrors={imageLoadErrors}
          onImageError={handleImageError}
        />
        <div className="controls">
          <button onClick={resetGame}>New Game</button>
        </div>
        <ScoreBoard
          player1Icon={player1Avatar}
          player2Icon={player2Avatar}
          scores={scores}
          imageLoadErrors={imageLoadErrors}
          onImageError={handleImageError}
        />
      </div>
    </div>
  );
};

export default App; 