export type Player = 1 | 2;
export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Phase = "placement" | "movement";
export type Difficulty = "easy" | "medium" | "hard";

export type Board = (Player | null)[];
export type WinningLine = [Position, Position, Position] | null;

export interface GameState {
  board: Board;
  currentPlayer: Player;
  selectedPiece: Position | null;
  phase: Phase;
  piecesPlaced: {
    1: number;
    2: number;
  };
  winner: Player | null;
  winningLine: WinningLine;
  botPlayer: Player | null;
  difficulty: Difficulty;
  gameStarted: boolean;
} 