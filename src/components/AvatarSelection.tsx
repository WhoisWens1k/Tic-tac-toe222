import React, { useState } from 'react';
import { avatarImages } from '../utils/avatarImages';
import ThemeSelector from './ThemeSelector';

// Using embedded avatar images
const avatarOptions = [
  { id: '1', content: avatarImages.avatar1, fallback: 'Avatar 1' },
  { id: '2', content: avatarImages.avatar2, fallback: 'Avatar 2' },
  { id: '3', content: avatarImages.avatar3, fallback: 'Avatar 3' }
];

interface AvatarSelectionProps {
  onSelect: (player1Avatar: string, player2Avatar: string) => void;
  onSelectTheme: (theme: string) => void;
  currentTheme: string;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({ onSelect, onSelectTheme, currentTheme }) => {
  const [player1Avatar, setPlayer1Avatar] = useState(avatarOptions[0].content);
  const [player2Avatar, setPlayer2Avatar] = useState(avatarOptions[1].content);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (imagePath: string) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [imagePath]: true
    }));
  };

  return (
    <div className="avatar-selection-container">
      <div className="avatar-selection">
        <h2>Choose Your Avatars</h2>
        
        <div className="theme-selection-container">
          <h3>Select Game Theme</h3>
          <ThemeSelector onSelectTheme={onSelectTheme} currentTheme={currentTheme} />
        </div>
        
        <div className="avatar-selection-grid">
          <div className="player-selection">
            <h3>Player 1</h3>
            <div className="avatar-grid">
              {avatarOptions.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`avatar-option ${player1Avatar === avatar.content ? 'selected' : ''}`}
                  onClick={() => setPlayer1Avatar(avatar.content)}
                >
                  {imageLoadErrors[avatar.content] ? (
                    <div className="avatar-fallback">{avatar.fallback}</div>
                  ) : (
                    <img 
                      src={avatar.content} 
                      alt={`Avatar ${avatar.id}`} 
                      className="avatar-image"
                      onError={() => handleImageError(avatar.content)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="selected-avatar">
              <p>Selected:</p>
              <div className="avatar-display">
                {imageLoadErrors[player1Avatar] ? (
                  <div className="avatar-fallback">
                    {avatarOptions.find(a => a.content === player1Avatar)?.fallback}
                  </div>
                ) : (
                  <img 
                    src={player1Avatar} 
                    alt="Selected Avatar" 
                    className="selected-avatar-image"
                    onError={() => handleImageError(player1Avatar)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="player-selection">
            <h3>Player 2</h3>
            <div className="avatar-grid">
              {avatarOptions.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`avatar-option ${player2Avatar === avatar.content ? 'selected' : ''}`}
                  onClick={() => setPlayer2Avatar(avatar.content)}
                >
                  {imageLoadErrors[avatar.content] ? (
                    <div className="avatar-fallback">{avatar.fallback}</div>
                  ) : (
                    <img 
                      src={avatar.content} 
                      alt={`Avatar ${avatar.id}`} 
                      className="avatar-image"
                      onError={() => handleImageError(avatar.content)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="selected-avatar">
              <p>Selected:</p>
              <div className="avatar-display">
                {imageLoadErrors[player2Avatar] ? (
                  <div className="avatar-fallback">
                    {avatarOptions.find(a => a.content === player2Avatar)?.fallback}
                  </div>
                ) : (
                  <img 
                    src={player2Avatar} 
                    alt="Selected Avatar" 
                    className="selected-avatar-image"
                    onError={() => handleImageError(player2Avatar)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <button 
          className="start-game-button"
          onClick={() => onSelect(player1Avatar, player2Avatar)}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default AvatarSelection; 