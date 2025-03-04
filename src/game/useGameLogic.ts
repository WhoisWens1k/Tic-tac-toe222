"use client"

import { useState, useCallback } from "react"
import type { GameState, Position, Player, Difficulty } from "./types"
import { isValidMove, checkWin, getValidMoves } from "./gameUtils"

const INITIAL_STATE: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 1,
  selectedPiece: null,
  phase: "placement",
  piecesPlaced: { 1: 0, 2: 0 },
  winner: null,
  winningLine: null,
  botPlayer: null,
  difficulty: "medium",
  gameStarted: false,
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)

  const handlePosition = useCallback((position: Position) => {
    setGameState((prevState) => {
      if (!prevState.gameStarted || prevState.winner || prevState.botPlayer === prevState.currentPlayer) {
        return prevState
      }

      const newState = { ...prevState }

      if (prevState.phase === "placement") {
        if (prevState.piecesPlaced[prevState.currentPlayer] >= 3 || prevState.board[position] !== null) {
          return prevState
        }

        newState.board = [...prevState.board]
        newState.board[position] = prevState.currentPlayer
        newState.piecesPlaced = {
          ...prevState.piecesPlaced,
          [prevState.currentPlayer]: prevState.piecesPlaced[prevState.currentPlayer] + 1,
        }

        if (newState.piecesPlaced[1] === 3 && newState.piecesPlaced[2] === 3) {
          newState.phase = "movement"
        }
      } else {
        if (prevState.selectedPiece === null) {
          if (prevState.board[position] === prevState.currentPlayer) {
            if (getValidMoves(position, prevState.board).length > 0) {
              newState.selectedPiece = position
            }
            return newState
          }
          return prevState
        } else {
          if (isValidMove(prevState.selectedPiece, position, prevState.board)) {
            newState.board = [...prevState.board]
            newState.board[position] = prevState.currentPlayer
            newState.board[prevState.selectedPiece] = null
            newState.selectedPiece = null
          } else {
            if (prevState.board[position] === prevState.currentPlayer) {
              if (getValidMoves(position, prevState.board).length > 0) {
                newState.selectedPiece = position
              } else {
                newState.selectedPiece = null
              }
            } else {
              newState.selectedPiece = null
            }
            return newState
          }
        }
      }

      const [winner, winningLine] = checkWin(newState.board)
      if (winner) {
        newState.winner = winner
        newState.winningLine = winningLine
        return newState
      }

      newState.currentPlayer = newState.currentPlayer === 1 ? 2 : 1
      return newState
    })
  }, [])

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE)
  }, [])

  const startGame = useCallback((botPlayer: Player | null, difficulty: Difficulty) => {
    setGameState({
      ...INITIAL_STATE,
      botPlayer,
      difficulty,
      gameStarted: true,
    })
  }, [])

  return { gameState, handlePosition, resetGame, startGame }
} 