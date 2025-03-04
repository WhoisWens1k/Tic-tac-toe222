# Modern Tic Tac Toe

A modern take on the classic Tic Tac Toe game, featuring a hexagonal board with 9 positions and two-phase gameplay.

## Game Rules

### Board Layout
- The game uses a hexagonal board with 9 positions (CP0 to CP8).
- CP8 is the central position, while CP0 to CP7 form an outer ring.

### Game Phases

#### 1. Placement Phase
- Each player starts with 3 pieces to place on the board.
- Players take turns placing one piece at a time on any empty position.
- This phase ends when all 6 pieces (3 per player) are placed on the board.

#### 2. Movement Phase
- After all pieces are placed, players take turns moving their pieces.
- A piece can move to any adjacent empty position, including the center (CP8).
- Adjacent positions are defined by the board's structure:
  - The center (CP8) is adjacent to all outer positions.
  - Outer positions are adjacent to their neighboring positions and the center.

### Winning Conditions
A player wins by forming a line of three of their pieces. Winning combinations include:
- Any three consecutive positions on the outer ring (e.g., CP0-CP1-CP2).
- Three positions forming a straight line through the center (e.g., CP0-CP8-CP4).

## Technical Details

This game is built using:
- React with TypeScript
- Framer Motion for animations
- SVG for the game board

## Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm start
```

## How to Play

1. The game starts in the Placement Phase.
2. Click on any empty position to place your piece.
3. After all pieces are placed, the game transitions to the Movement Phase.
4. Click on one of your pieces to select it, then click on an adjacent empty position to move it.
5. The first player to form a line of three pieces wins!

## Features

- Two-phase gameplay (Placement and Movement)
- Score tracking across games
- Visual highlighting of valid moves
- Winning line animation
- Responsive design for all screen sizes 