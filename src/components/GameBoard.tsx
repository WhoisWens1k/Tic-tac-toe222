import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Board, Position, WinningLine } from '../game/types';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import BIRDS from 'vanta/dist/vanta.birds.min';
import FOG from 'vanta/dist/vanta.fog.min';
import NET from 'vanta/dist/vanta.net.min';
import DOTS from 'vanta/dist/vanta.dots.min';
import RINGS from 'vanta/dist/vanta.rings.min';

interface GameBoardProps {
  board: Board;
  currentPlayer: number;
  selectedPosition: Position | null;
  winningLine: WinningLine;
  player1Icon: string;
  player2Icon: string;
  onPositionClick: (position: Position) => void;
  gamePhase: 'placement' | 'movement';
  imageLoadErrors?: Record<string, boolean>;
  onImageError?: (imagePath: string) => void;
  theme: string;
}

// SVG dimensions and calculations
const SVG_WIDTH = 600;
const SVG_HEIGHT = 600;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;
const RADIUS = 160; // Reduced from 180 to ensure pieces aren't cut off
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
  onImageError = () => {},
  theme
}) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Only initialize if the ref is available and we haven't already initialized
    if (vantaRef.current && !isInitializedRef.current) {
      isInitializedRef.current = true;
      
      // Create new effect with current theme
      try {
        switch (theme) {
          case 'clouds':
            vantaEffectRef.current = CLOUDS({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              backgroundColor: 0x1a365d,
              cloudColor: 0x87ceeb,
              speed: 1.0,
            });
            break;
          case 'waves':
            vantaEffectRef.current = CLOUDS({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              backgroundColor: 0x0a2e44,
              cloudColor: 0x00bfff,
              speed: 1.5,
            });
            break;
          case 'fog':
            vantaEffectRef.current = FOG({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              highlightColor: 0xffffff,
              midtoneColor: 0x8c8c8c,
              lowlightColor: 0x2c3e50,
              baseColor: 0x2c3e50,
              blurFactor: 0.6,
              speed: 1.0,
              zoom: 1.0
            });
            break;
          case 'birds':
            vantaEffectRef.current = BIRDS({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              backgroundColor: 0x0a192f,
              color1: 0x64ffda,
              color2: 0x7928ca,
              colorMode: "variance",
              birdSize: 1.0,
              wingSpan: 20.0,
              speedLimit: 5.0,
              separation: 30.0,
              alignment: 30.0,
              cohesion: 30.0,
              quantity: 3.0
            });
            break;
          case 'net':
            vantaEffectRef.current = NET({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x3f51b5,
              backgroundColor: 0x0a192f,
              points: 10,
              maxDistance: 20.0,
              spacing: 15.0
            });
            break;
          case 'dots':
            try {
              vantaEffectRef.current = DOTS({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200,
                minWidth: 200,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0xff3f81,
                color2: 0x7928ca,
                backgroundColor: 0x0a192f,
                size: 3.0,
                spacing: 35.0,
                showLines: true
              });
            } catch (error) {
              console.error("Error initializing dots effect:", error);
              // Fallback to clouds if dots fails
              vantaEffectRef.current = CLOUDS({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200,
                minWidth: 200,
                scale: 1.0,
                scaleMobile: 1.0,
                backgroundColor: 0x1a365d,
                cloudColor: 0x87ceeb,
                speed: 1.0,
              });
            }
            break;
          case 'rings':
            vantaEffectRef.current = RINGS({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              backgroundColor: 0x0a192f,
              color: 0xff3f81
            });
            break;
          default:
            vantaEffectRef.current = CLOUDS({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              backgroundColor: 0x1a365d,
              cloudColor: 0x87ceeb,
              speed: 1.0,
            });
        }
      } catch (error) {
        console.error("Error initializing Vanta effect:", error);
        // Fallback to a simple background color if all else fails
        if (vantaRef.current) {
          vantaRef.current.style.backgroundColor = '#1a365d';
        }
      }
    } else if (vantaRef.current && isInitializedRef.current && vantaEffectRef.current) {
      // If we're changing themes and already have an effect initialized
      try {
        // Safely destroy the previous effect
        if (vantaEffectRef.current && typeof vantaEffectRef.current.destroy === 'function') {
          vantaEffectRef.current.destroy();
        }
        
        // Reset the effect reference
        vantaEffectRef.current = null;
        
        // Re-initialize with the new theme (on the next render)
        isInitializedRef.current = false;
      } catch (error) {
        console.error("Error cleaning up Vanta effect:", error);
      }
    }
    
    // Cleanup function
    return () => {
      try {
        if (vantaEffectRef.current && typeof vantaEffectRef.current.destroy === 'function') {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }
      } catch (error) {
        console.error("Error in cleanup:", error);
      }
    };
  }, [theme]);

  // Calculate position coordinates
  const positions = useMemo(() => calculatePositionCoordinates(), []);
  
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
        stroke={board[a] === 1 ? "#0088FF" : "#FF4444"}
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
    
    return piece === 1 ? player1Icon : player2Icon;
  };

  // Get player fallback text for a position
  const getPlayerFallback = (position: Position) => {
    const piece = board[position];
    if (!piece) return '';
    
    return piece === 1 ? 'P1' : 'P2';
  };
  
  return (
    <>
      <div ref={vantaRef} className="game-board"></div>
      <div className="board-container">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
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
                {/* Position glow effect */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={30}
                  fill="transparent"
                  stroke={
                    isSelected
                      ? "#FFCC00"
                      : isValidMoveTarget
                      ? "#44FF44"
                      : "transparent"
                  }
                  strokeWidth={2}
                  opacity={0.6}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 0.8] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Visible circle */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={25}
                  fill={
                    isSelected
                      ? "rgba(255, 204, 0, 0.7)"
                      : isValidMoveTarget
                      ? "rgba(68, 255, 68, 0.7)"
                      : "rgba(30, 30, 40, 0.7)"
                  }
                  stroke={
                    piece === 1
                      ? "#0088FF"
                      : piece === 2
                      ? "#FF4444"
                      : "rgba(80, 80, 100, 0.4)"
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
                    fill="rgba(180, 180, 220, 0.7)"
                    fontSize="12px"
                  >
                    CP{position}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
};

export default React.memo(GameBoard); 