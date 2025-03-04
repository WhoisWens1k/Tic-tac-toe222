import React from 'react';

interface ScoreBoardProps {
  player1Icon: string;
  player2Icon: string;
  scores: {
    PLAYER_ONE: number;
    PLAYER_TWO: number;
  };
  imageLoadErrors?: Record<string, boolean>;
  onImageError?: (imagePath: string) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  player1Icon, 
  player2Icon, 
  scores,
  imageLoadErrors = {},
  onImageError = () => {}
}) => {
  return (
    <div className="score">
      <div className="score-item">
        <div className="player-icon">
          {imageLoadErrors[player1Icon] ? (
            <div className="avatar-fallback">P1</div>
          ) : (
            <img 
              src={player1Icon} 
              alt="Player 1" 
              className="avatar-image"
              onError={() => onImageError(player1Icon)}
            />
          )}
        </div>
        <div className="player-score">{scores.PLAYER_ONE}</div>
      </div>
      <div className="score-divider">:</div>
      <div className="score-item">
        <div className="player-icon">
          {imageLoadErrors[player2Icon] ? (
            <div className="avatar-fallback">P2</div>
          ) : (
            <img 
              src={player2Icon} 
              alt="Player 2" 
              className="avatar-image"
              onError={() => onImageError(player2Icon)}
            />
          )}
        </div>
        <div className="player-score">{scores.PLAYER_TWO}</div>
      </div>
    </div>
  );
};

export default React.memo(ScoreBoard); 