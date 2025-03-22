import React, { useMemo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Board, Position, WinningLine } from '../game/types';
import NetworkEffect from './NetworkEffect';
import ParticleBackground from './ParticleBackground';
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

// Fallback styles when the theme effect fails to load
const getFallbackStyle = (theme: string) => {
  const styles: Record<string, React.CSSProperties> = {
    clouds: {
      background: 'linear-gradient(45deg, #1a365d, #4a90e2)',
    },
    waves: {
      background: 'linear-gradient(45deg, #0a2e44, #1e6091)',
    },
    fog: {
      background: 'linear-gradient(45deg, #2c3e50, #3498db)',
    },
    birds: {
      background: 'linear-gradient(45deg, #0a192f, #233554)',
    },
    net: {
      background: 'linear-gradient(45deg, #0a192f, #112240)',
    },
    dots: {
      background: 'linear-gradient(45deg, #0a192f, #1a365d)',
    },
    rings: {
      background: 'linear-gradient(45deg, #0a192f, #233554)',
    }
  };
  
  return styles[theme] || styles.clouds;
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
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);

  // Theme configuration presets
  const themeConfigs = {
    clouds: {
      effect: CLOUDS,
      options: {
        backgroundColor: 0x1a365d,
        cloudColor: 0x87ceeb,
        speed: 1.0,
      }
    },
    waves: {
      effect: CLOUDS,
      options: {
        backgroundColor: 0x0a2e44,
        cloudColor: 0x00bfff,
        speed: 1.5,
      }
    },
    fog: {
      effect: FOG,
      options: {
        highlightColor: 0xffffff,
        midtoneColor: 0x8c8c8c,
        lowlightColor: 0x2c3e50,
        baseColor: 0x2c3e50,
        blurFactor: 0.6,
        speed: 1.0,
        zoom: 1.0
      }
    },
    birds: {
      effect: BIRDS,
      options: {
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
      }
    },
    net: {
      effect: NET,
      options: {
        color: 0x3f51b5,
        backgroundColor: 0x0a192f,
        points: 10,
        maxDistance: 20.0,
        spacing: 15.0
      }
    },
    dots: {
      effect: DOTS,
      options: {
        color: 0xff3f81,
        color2: 0x7928ca,
        backgroundColor: 0x0a192f,
        size: 3.0,
        spacing: 35.0,
        showLines: true
      }
    },
    rings: {
      effect: RINGS,
      options: {
        backgroundColor: 0x0a192f,
        color: 0xff3f81
      }
    }
  };

  // Initialize or update the Vanta effect
  const initVantaEffect = () => {
    if (!vantaRef.current) return;
    
    // Clean up any existing effect
    if (vantaEffectRef.current) {
      try {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      } catch (error) {
        console.error("Error cleaning up previous effect:", error);
      }
    }

    // Apply fallback style immediately (will be overridden by Vanta if successful)
    if (vantaRef.current) {
      const fallbackStyle = getFallbackStyle(theme);
      Object.assign(vantaRef.current.style, fallbackStyle);
    }

    setThemeLoaded(false);
    setFallbackActive(false);

    // Get theme configuration
    const themeConfig = themeConfigs[theme as keyof typeof themeConfigs] || themeConfigs.clouds;
    
    try {
      // Initialize the new effect with common options and theme-specific options
      vantaEffectRef.current = themeConfig.effect({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        ...themeConfig.options
      });
      
      setThemeLoaded(true);
    } catch (error) {
      console.error(`Error initializing ${theme} effect:`, error);
      setFallbackActive(true);
      
      // Try to initialize the clouds effect as a fallback
      if (theme !== 'clouds') {
        try {
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
          setThemeLoaded(true);
        } catch (fallbackError) {
          console.error("Error initializing fallback effect:", fallbackError);
          // Keep the fallback style applied
        }
      }
    }
  };

  // Effect to initialize or update the Vanta effect when the theme changes
  useEffect(() => {
    // Only initialize if the ref is available
    if (vantaRef.current) {
      // Set a small timeout to ensure the DOM is fully ready
      const timeoutId = setTimeout(() => {
        initVantaEffect();
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        // Clean up on unmount
        if (vantaEffectRef.current) {
          try {
            vantaEffectRef.current.destroy();
            vantaEffectRef.current = null;
          } catch (error) {
            console.error("Error in cleanup:", error);
          }
        }
      };
    }
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
      <div 
        ref={vantaRef} 
        className={`game-board ${themeLoaded ? 'theme-loaded' : ''} ${fallbackActive ? 'fallback-active' : ''} ${theme}-theme`}
        style={fallbackActive ? getFallbackStyle(theme) : undefined}
      >
        {theme === 'net' && <NetworkEffect />}
        <ParticleBackground 
          count={30} 
          speed={0.3} 
          color1={theme === 'clouds' || theme === 'waves' ? '#00b4d8' : 
                 theme === 'fog' ? '#9900ff' : 
                 theme === 'birds' ? '#ff3f81' : 
                 '#00b4d8'}
          color2={theme === 'clouds' || theme === 'waves' ? '#0077b6' : 
                 theme === 'fog' ? '#ff00bc' : 
                 theme === 'birds' ? '#4a90e2' : 
                 '#bf3fff'}
        />
      </div>
      
      <div className={`game-phase-indicator ${gamePhase}-phase`}>
        <span>{gamePhase === 'placement' ? 'Placement Phase' : 'Movement Phase'}</span>
      </div>
      
      <div className={`current-player player-${currentPlayer}-turn`}>
        <div className="current-player-indicator">
          <div className="current-player-avatar">
            {imageLoadErrors[currentPlayer === 1 ? player1Icon : player2Icon] ? (
              <div className="avatar-fallback">P{currentPlayer}</div>
            ) : (
              <img 
                src={currentPlayer === 1 ? player1Icon : player2Icon} 
                alt={`Player ${currentPlayer}`} 
                className="avatar-image"
                onError={() => onImageError(currentPlayer === 1 ? player1Icon : player2Icon)}
              />
            )}
          </div>
          <span className="player-turn-text">Player {currentPlayer}'s Turn</span>
        </div>
      </div>
      
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
                    <image
                      href={playerIcon}
                      x={pos.x - 20}
                      y={pos.y - 20}
                      height="40"
                      width="40"
                      className="player-piece"
                      onError={() => onImageError(playerIcon)}
                    />
                  )
                ) : (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255, 255, 255, 0.6)"
                    fontSize="12px"
                    className="position-label"
                  >
                    {`CP${position}`}
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

export default GameBoard; 