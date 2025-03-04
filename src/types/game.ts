export enum Player {
  One = 'PLAYER_ONE',
  Two = 'PLAYER_TWO'
}

export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type BoardState = (Player | null)[];

export type GamePhase = 'placement' | 'movement';

export type WinningLine = [Position, Position, Position] | null;

export interface Scores {
  [Player.One]: number;
  [Player.Two]: number;
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  selectedPosition: Position | null;
  gamePhase: GamePhase;
  winner: Player | null;
  winningLine: WinningLine;
  scores: Scores;
}

// Define adjacent positions for each position on the board
export const ADJACENT_POSITIONS: Record<Position, Position[]> = {
  0: [1, 7, 8], // Right: adjacent to Bottom-Right, Top-Right, and Center
  1: [0, 2, 8], // Bottom-Right: adjacent to Right, Bottom, and Center
  2: [1, 3, 8], // Bottom: adjacent to Bottom-Right, Bottom-Left, and Center
  3: [2, 4, 8], // Bottom-Left: adjacent to Bottom, Left, and Center
  4: [3, 5, 8], // Left: adjacent to Bottom-Left, Top-Left, and Center
  5: [4, 6, 8], // Top-Left: adjacent to Left, Top, and Center
  6: [5, 7, 8], // Top: adjacent to Top-Left, Top-Right, and Center
  7: [6, 0, 8], // Top-Right: adjacent to Top, Right, and Center
  8: [0, 1, 2, 3, 4, 5, 6, 7], // Center: adjacent to all other positions
};

// Define winning combinations
export const WINNING_COMBINATIONS: [Position, Position, Position][] = [
  // Outer ring consecutive positions
  [0, 1, 2], // Right, Bottom-Right, Bottom
  [2, 3, 4], // Bottom, Bottom-Left, Left
  [4, 5, 6], // Left, Top-Left, Top
  [6, 7, 0], // Top, Top-Right, Right
  
  // Lines through center
  [0, 8, 4], // Right, Center, Left
  [1, 8, 5], // Bottom-Right, Center, Top-Left
  [2, 8, 6], // Bottom, Center, Top
  [3, 8, 7], // Bottom-Left, Center, Top-Right
]; 