import type { Board, Player, Position, WinningLine } from "./types";

// Define the winning combinations
const WINNING_COMBINATIONS: [Position, Position, Position][] = [
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

// Define adjacent positions for each position on the board
const ADJACENT_POSITIONS: Record<Position, Position[]> = {
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

/**
 * Check if a move from one position to another is valid
 */
export function isValidMove(from: Position, to: Position, board: Board): boolean {
  // Check if the destination is empty
  if (board[to] !== null) {
    return false;
  }
  
  // Check if the destination is adjacent to the source
  return ADJACENT_POSITIONS[from].includes(to);
}

/**
 * Get all valid moves for a piece at a given position
 */
export function getValidMoves(position: Position, board: Board): Position[] {
  return ADJACENT_POSITIONS[position].filter(pos => board[pos] === null);
}

/**
 * Check if there's a winner on the board
 * Returns [winner, winningLine] or [null, null] if no winner
 */
export function checkWin(board: Board): [Player | null, WinningLine] {
  console.log('Checking for win...');
  console.log('Current board state:', board.map((cell, index) => `${index}:${cell}`).join(', '));
  
  // Log all winning combinations for debugging
  console.log('All winning combinations:');
  WINNING_COMBINATIONS.forEach((combo, index) => {
    console.log(`Combo ${index}: [${combo.join(', ')}]`);
  });
  
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    console.log(`Checking combination: [${a}, ${b}, ${c}]`);
    console.log(`Values: [${board[a]}, ${board[b]}, ${board[c]}]`);
    
    if (
      board[a] !== null &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      console.log(`Win detected! Player: ${board[a]}`);
      return [board[a] as Player, combination];
    }
  }
  
  console.log('No win detected');
  return [null, null];
} 