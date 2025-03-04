import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Player, Position, BoardState, WinningLine, GamePhase } from '../types/game';

interface GameBoardProps {
  board: BoardState;
  currentPlayer: Player;
  selectedPosition: Position | null;
  winningLine: WinningLine;
  player1Icon: string;
  player2Icon: string;
  onPositionClick: (position: Position) => void;
  gamePhase: GamePhase;
  imageLoadErrors?: Record<string, boolean>;
  onImageError?: (imagePath: string) => void;
}

// SVG dimensions and calculations
const SVG_WIDTH = 600;
const SVG_HEIGHT = 600;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;
const RADIUS = 180; // Distance from center to outer points
const POSITION_RADIUS = 30; // Radius of position circles

// Calculate position coordinates
const calculatePositionCoordinates = () => {
  const positions = [
    { x: CENTER_X + RADIUS, y: CENTER_Y }, // CP0 - Right
    { x: CENTER_X + RADIUS * Math.cos(Math.PI / 4), y: CENTER_Y + RADIUS * Math.sin(Math.PI / 4) }, // CP1 - Bottom Right
    { x: CENTER_X, y: CENTER_Y + RADIUS }, // CP2 - Bottom
    { x: CENTER_X - RADIUS * Math.cos(Math.PI / 4), y: CENTER_Y + RADIUS * Math.sin(Math.PI / 4) }, // CP3 - Bottom Left
    { x: CENTER_X - RADIUS, y: CENTER_Y }, // CP4 - Left
    { x: CENTER_X - RADIUS * Math.cos(Math.PI / 4), y: CENTER_Y - RADIUS * Math.sin(Math.PI / 4) }, // CP5 - Top Left
    { x: CENTER_X, y: CENTER_Y - RADIUS }, // CP6 - Top
    { x: CENTER_X + RADIUS * Math.cos(Math.PI / 4), y: CENTER_Y - RADIUS * Math.sin(Math.PI / 4) }, // CP7 - Top Right
    { x: CENTER_X, y: CENTER_Y } // CP8 - Center
  ];
  
  return positions;
};

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPlayer,
  selectedPosition,
  winningLine,
  player1Icon,
  player2Icon,
  onPositionClick,
  gamePhase,
  imageLoadErrors = {},
  onImageError = () => {}
}) => {
  // Calculate position coordinates
  const positions = useMemo(() => calculatePositionCoordinates(), []);
  
  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    
    // Outer octagon
    for (let i = 0; i < 8; i++) {
      const start = positions[i];
      const end = positions[(i + 1) % 8];
      
      lines.push(
        <motion.line
          key={`outer-${i}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#00BFFF"
          strokeWidth={2}
          strokeDasharray={i % 2 === 0 ? "5,5" : "none"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: i * 0.1 }}
        />
      );
    }
    
    // Spokes from center
    for (let i = 0; i < 8; i++) {
      const start = positions[8]; // Center
      const end = positions[i];
      
      lines.push(
        <motion.line
          key={`spoke-${i}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#00BFFF"
          strokeWidth={2}
          strokeDasharray={i % 2 === 0 ? "none" : "5,5"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
        />
      );
    }
    
    return lines;
  }, [positions]);
  
  // Generate winning line if there is a winner
  const winningLineElement = useMemo(() => {
    if (!winningLine) return null;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [a, _, c] = winningLine; // Using _ to indicate unused variable
    const startPos = positions[a];
    const endPos = positions[c];
    
    return (
      <motion.line
        x1={startPos.x}
        y1={startPos.y}
        x2={endPos.x}
        y2={endPos.y}
        stroke={board[a] === Player.One ? "#0088FF" : "#FF4444"}
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="win-line"
      />
    );
  }, [winningLine, positions, board]);
  
  // Check if a position is a valid move for the selected piece
  const isValidMove = (position: Position): boolean => {
    if (gamePhase !== 'movement' || selectedPosition === null) return false;
    
    // Check if the position is empty
    if (board[position] !== null) return false;
    
    // Check if the position is adjacent to the selected position
    const adjacentPositions = [
      // Horizontal and vertical adjacency
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
      // Center adjacency
      [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]
    ];
    
    return adjacentPositions.some(([a, b]) => 
      (selectedPosition === a && position === b) || 
      (selectedPosition === b && position === a)
    );
  };

  // Get player icon for a position
  const getPlayerIcon = (position: Position) => {
    const piece = board[position];
    if (!piece) return '';
    
    return piece === Player.One ? player1Icon : player2Icon;
  };

  // Get player fallback text for a position
  const getPlayerFallback = (position: Position) => {
    const piece = board[position];
    if (!piece) return '';
    
    return piece === Player.One ? 'P1' : 'P2';
  };
  
  return (
    <div className="board-container">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#121212" />
        
        {/* Grid lines */}
        {gridLines}
        
        {/* Winning line */}
        {winningLineElement}
        
        {/* Positions */}
        {positions.map((pos, index) => {
          const position = index as Position;
          const piece = board[position];
          const isSelected = selectedPosition === position;
          const isValidMoveTarget = selectedPosition !== null && isValidMove(position);
          const playerIcon = getPlayerIcon(position);
          const hasImageError = playerIcon && imageLoadErrors[playerIcon];
          
          return (
            <g key={`position-${position}`} onClick={() => onPositionClick(position)}>
              {/* Visible circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={25}
                fill={
                  isSelected
                    ? "#FFCC00"
                    : isValidMoveTarget
                    ? "#44FF44"
                    : "#333333"
                }
                stroke={
                  piece === Player.One
                    ? "#0088FF"
                    : piece === Player.Two
                    ? "#FF4444"
                    : "transparent"
                }
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="position"
              />
              
              {/* Position label or player piece */}
              {piece ? (
                hasImageError ? (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14px"
                    className="player-piece-fallback"
                  >
                    {getPlayerFallback(position)}
                  </text>
                ) : (
                  <foreignObject 
                    x={pos.x - 20} 
                    y={pos.y - 20} 
                    width={40} 
                    height={40}
                  >
                    <div 
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        borderRadius: '50%'
                      }}
                    >
                      <img 
                        src={playerIcon} 
                        alt={`Player ${piece}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={() => playerIcon && onImageError(playerIcon)}
                      />
                    </div>
                  </foreignObject>
                )
              ) : (
                <text
                  x={pos.x}
                  y={pos.y}
                  className="position-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                >
                  CP{position}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default React.memo(GameBoard); 