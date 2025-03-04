import { useState, useEffect, useCallback } from 'react';
import { 
  Player, 
  Position, 
  BoardState, 
  GamePhase, 
  WinningLine, 
  Scores,
  ADJACENT_POSITIONS,
  WINNING_COMBINATIONS
} from '../types/game';

// Initialize the board with 9 null positions
const createEmptyBoard = (): BoardState => Array(9).fill(null);

// Initialize scores
const initialScores: Scores = {
  [Player.One]: 0,
  [Player.Two]: 0
};

// Load scores from localStorage if available
const loadScores = (): Scores => {
  try {
    const savedScores = localStorage.getItem('ticTacToeScores');
    return savedScores ? JSON.parse(savedScores) : initialScores;
  } catch (error) {
    console.error('Error loading scores from localStorage:', error);
    return initialScores;
  }
};

// Debug function to log the current board state
const logBoardState = (board: BoardState) => {
  console.log('Current board state:');
  console.log(`[${board.map(cell => cell === null ? 'null' : cell === Player.One ? 'P1' : 'P2').join(', ')}]`);
};

export const useGameLogic = () => {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.One);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('placement');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);
  const [scores, setScores] = useState<Scores>(loadScores());
  
  // Count pieces for each player
  const countPlayerPieces = useCallback((player: Player): number => {
    return board.filter(pos => pos === player).length;
  }, [board]);
  
  // Check if the game should transition from placement to movement phase
  useEffect(() => {
    if (gamePhase === 'placement') {
      const player1Pieces = countPlayerPieces(Player.One);
      const player2Pieces = countPlayerPieces(Player.Two);
      
      if (player1Pieces === 3 && player2Pieces === 3) {
        setGamePhase('movement');
      }
    }
  }, [board, gamePhase, countPlayerPieces]);
  
  // Check for a win after each move
  const checkWin = useCallback((): boolean => {
    console.log('Checking for win...');
    console.log('Current board state:', board);
    console.log('Winning combinations:', WINNING_COMBINATIONS);
    
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
        setWinner(board[a] as Player);
        setWinningLine(combination);
        
        // Update scores
        setScores(prevScores => {
          const newScores = {
            ...prevScores,
            [board[a] as Player]: prevScores[board[a] as Player] + 1
          };
          
          // Save to localStorage
          try {
            localStorage.setItem('ticTacToeScores', JSON.stringify(newScores));
          } catch (error) {
            console.error('Error saving scores to localStorage:', error);
          }
          
          return newScores;
        });
        
        return true;
      }
    }
    console.log('No win detected');
    return false;
  }, [board]);
  
  // Get valid moves for a selected piece in movement phase
  const getValidMoves = useCallback((position: Position): Position[] => {
    if (gamePhase !== 'movement') return [];
    
    return ADJACENT_POSITIONS[position].filter(pos => board[pos] === null);
  }, [board, gamePhase]);
  
  // Handle position click based on game phase
  const handlePositionClick = useCallback((position: Position) => {
    // If there's a winner, don't allow further moves
    if (winner) return;
    
    if (gamePhase === 'placement') {
      // Placement phase: place a piece if the position is empty
      if (board[position] === null) {
        const newBoard = [...board];
        newBoard[position] = currentPlayer;
        
        console.log(`Placing ${currentPlayer} at position ${position}`);
        setBoard(newBoard);
        logBoardState(newBoard);
        
        // Check for a win
        const gameWon = checkWin();
        
        // Switch player if game not won
        if (!gameWon) {
          setCurrentPlayer(currentPlayer === Player.One ? Player.Two : Player.One);
        }
      }
    } else {
      // Movement phase
      if (selectedPosition === null) {
        // If no piece is selected, select one of the current player's pieces
        if (board[position] === currentPlayer) {
          setSelectedPosition(position);
        }
      } else {
        // If a piece is already selected
        if (position === selectedPosition) {
          // Deselect if clicking the same piece
          setSelectedPosition(null);
        } else if (board[position] === currentPlayer) {
          // Select a different piece of the same player
          setSelectedPosition(position);
        } else if (board[position] === null) {
          // Try to move to an empty position
          const validMoves = getValidMoves(selectedPosition);
          
          if (validMoves.includes(position)) {
            // Valid move, update the board
            const newBoard = [...board];
            newBoard[position] = currentPlayer;
            newBoard[selectedPosition] = null;
            
            console.log(`Moving ${currentPlayer} from ${selectedPosition} to ${position}`);
            setBoard(newBoard);
            logBoardState(newBoard);
            
            setSelectedPosition(null);
            
            // Check for a win
            const gameWon = checkWin();
            
            // Switch player if game not won
            if (!gameWon) {
              setCurrentPlayer(currentPlayer === Player.One ? Player.Two : Player.One);
            }
          }
        }
      }
    }
  }, [board, currentPlayer, gamePhase, selectedPosition, winner, checkWin, getValidMoves]);
  
  // Reset the game
  const resetGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
    setCurrentPlayer(Player.One);
    setSelectedPosition(null);
    setGamePhase('placement');
    setWinner(null);
    setWinningLine(null);
    console.log('Game reset');
    logBoardState(emptyBoard);
  }, []);
  
  return {
    board,
    currentPlayer,
    selectedPosition,
    gamePhase,
    winner,
    winningLine,
    scores,
    handlePositionClick,
    resetGame,
    getValidMoves
  };
}; 