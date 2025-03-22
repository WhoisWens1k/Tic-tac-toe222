import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameProps {
  player1Avatar: string;
  player2Avatar: string;
}

type Player = 1 | 2;
type Cell = Player | null;
type Board = Cell[];

const Game: React.FC<GameProps> = ({ player1Avatar, player2Avatar }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (boardState: Board): Player | 'draw' | null => {
    // Check for winner
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a] as Player;
      }
    }
    
    // Check for draw
    if (boardState.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      if (gameResult !== 'draw') {
        setScores(prev => ({
          ...prev,
          [gameResult === 1 ? 'player1' : 'player2']: prev[gameResult === 1 ? 'player1' : 'player2'] + 1
        }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setWinner(null);
  };

  const handleNewGame = () => {
    navigate('/');
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Game in Progress</h1>
      
      <div className="game-info">
        <div className="player-info">
          <div className={`player-avatar ${currentPlayer === 1 ? 'active' : ''}`}>
            <img src={player1Avatar} alt="Player 1" />
            <span>Player 1</span>
            <div className="score">{scores.player1}</div>
          </div>
          <div className={`player-avatar ${currentPlayer === 2 ? 'active' : ''}`}>
            <img src={player2Avatar} alt="Player 2" />
            <span>Player 2</span>
            <div className="score">{scores.player2}</div>
          </div>
        </div>
      </div>

      <div className="game-board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell ? 'filled' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            {cell && (
              <img
                src={cell === 1 ? player1Avatar : player2Avatar}
                alt={`Player ${cell}`}
                className="cell-avatar"
              />
            )}
          </div>
        ))}
      </div>

      {winner && (
        <div className="game-over">
          <h2>
            {winner === 'draw' 
              ? "It's a Draw!" 
              : `Player ${winner} Wins!`}
          </h2>
          <div className="game-over-buttons">
            <button onClick={resetGame}>Play Again</button>
            <button onClick={handleNewGame}>New Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 