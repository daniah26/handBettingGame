import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Tile types
type TileSuit = 'bamboo' | 'circle' | 'character' | 'wind' | 'dragon';
type WindType = 'east' | 'south' | 'west' | 'north';
type DragonType = 'red' | 'green' | 'white';

interface Tile {
  id: string;
  suit: TileSuit;
  value: number | WindType | DragonType;
  displayValue: number;
  displayName: string;
}

interface HandHistory {
  tiles: Tile[];
  totalValue: number;
  result: 'win' | 'lose' | null;
  bet: 'higher' | 'lower' | null;
}

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {
  // Cursor glow effect
  mouseX = 0;
  mouseY = 0;

  // Game state
  score = 0;
  currentHand: Tile[] = [];
  currentHandValue = 0;
  previousHand: HandHistory | null = null;
  handHistory: HandHistory[] = [];

  // Deck management
  drawPileCount = 136;
  discardPileCount = 0;
  reshuffleCount = 0;
  maxReshuffles = 3;

  // Non-number tile values (dynamic)
  dragonValues: Record<DragonType, number> = { red: 5, green: 5, white: 5 };
  windValues: Record<WindType, number> = { east: 5, south: 5, west: 5, north: 5 };

  // Game over state
  isGameOver = false;
  gameOverReason = '';

  // UI state
  isRevealing = false;
  showResult = false;
  lastBetResult: 'win' | 'lose' | null = null;

  // Particles for background effect
  particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    size: 3 + Math.random() * 3
  }));

  constructor(private router: Router) {
    this.drawNewHand();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  get glowStyle() {
    return {
      background: `radial-gradient(800px circle at ${this.mouseX}px ${this.mouseY}px, rgba(217, 4, 41, 0.12), transparent 50%)`
    };
  }

  // Generate a random tile
  generateTile(): Tile {
    const suits: TileSuit[] = ['bamboo', 'circle', 'character', 'wind', 'dragon'];
    const suit = suits[Math.floor(Math.random() * suits.length)];

    let value: number | WindType | DragonType;
    let displayValue: number;
    let displayName: string;

    if (suit === 'bamboo' || suit === 'circle' || suit === 'character') {
      value = Math.floor(Math.random() * 9) + 1;
      displayValue = value;
      displayName = `${value} ${suit}`;
    } else if (suit === 'wind') {
      const winds: WindType[] = ['east', 'south', 'west', 'north'];
      value = winds[Math.floor(Math.random() * winds.length)];
      displayValue = this.windValues[value];
      displayName = `${value} wind`;
    } else {
      const dragons: DragonType[] = ['red', 'green', 'white'];
      value = dragons[Math.floor(Math.random() * dragons.length)];
      displayValue = this.dragonValues[value];
      displayName = `${value} dragon`;
    }

    return {
      id: `${suit}-${value}-${Date.now()}-${Math.random()}`,
      suit,
      value,
      displayValue,
      displayName
    };
  }

  // Draw a new hand (3 tiles)
  drawNewHand() {
    if (this.drawPileCount < 3) {
      this.reshuffleDeck();
    }

    this.currentHand = [
      this.generateTile(),
      this.generateTile(),
      this.generateTile()
    ];

    this.currentHandValue = this.currentHand.reduce((sum, tile) => sum + tile.displayValue, 0);
    this.drawPileCount -= 3;
    this.showResult = false;
    this.lastBetResult = null;
  }

  // Reshuffle deck
  reshuffleDeck() {
    this.reshuffleCount++;
    if (this.reshuffleCount >= this.maxReshuffles) {
      this.endGame('Draw pile exhausted 3 times');
      return;
    }
    this.drawPileCount = 136 + this.discardPileCount;
    this.discardPileCount = 0;
  }

  // Place a bet
  placeBet(bet: 'higher' | 'lower') {
    if (this.isRevealing || this.isGameOver) return;

    this.isRevealing = true;
    const previousValue = this.currentHandValue;

    // Store current hand in history
    this.previousHand = {
      tiles: [...this.currentHand],
      totalValue: this.currentHandValue,
      result: null,
      bet
    };

    // Draw new hand after animation
    setTimeout(() => {
      this.discardPileCount += 3;
      this.drawNewHand();

      // Determine win/lose
      const newValue = this.currentHandValue;
      let won = false;

      if (bet === 'higher') {
        won = newValue > previousValue;
      } else {
        won = newValue < previousValue;
      }

      // Update score and tile values
      if (won) {
        this.score += this.currentHandValue;
        this.updateTileValues(true);
        this.lastBetResult = 'win';
      } else {
        this.updateTileValues(false);
        this.lastBetResult = 'lose';
      }

      if (this.previousHand) {
        this.previousHand.result = won ? 'win' : 'lose';
        this.handHistory.unshift(this.previousHand);
        if (this.handHistory.length > 5) {
          this.handHistory.pop();
        }
      }

      this.showResult = true;
      this.isRevealing = false;

      // Check game over conditions
      this.checkGameOverConditions();
    }, 600);
  }

  // Update non-number tile values based on win/lose
  updateTileValues(won: boolean) {
    const delta = won ? 1 : -1;

    this.currentHand.forEach(tile => {
      if (tile.suit === 'dragon') {
        const dragonType = tile.value as DragonType;
        this.dragonValues[dragonType] = Math.max(0, Math.min(10, this.dragonValues[dragonType] + delta));
      } else if (tile.suit === 'wind') {
        const windType = tile.value as WindType;
        this.windValues[windType] = Math.max(0, Math.min(10, this.windValues[windType] + delta));
      }
    });
  }

  // Check game over conditions
  checkGameOverConditions() {
    // Check if any tile value reached 0 or 10
    for (const [type, value] of Object.entries(this.dragonValues)) {
      if (value <= 0 || value >= 10) {
        this.endGame(`${type} dragon value reached ${value}`);
        return;
      }
    }

    for (const [type, value] of Object.entries(this.windValues)) {
      if (value <= 0 || value >= 10) {
        this.endGame(`${type} wind value reached ${value}`);
        return;
      }
    }
  }

  // End the game
  endGame(reason: string) {
    this.isGameOver = true;
    this.gameOverReason = reason;
  }

  // Restart game
  restartGame() {
    this.score = 0;
    this.currentHand = [];
    this.previousHand = null;
    this.handHistory = [];
    this.drawPileCount = 136;
    this.discardPileCount = 0;
    this.reshuffleCount = 0;
    this.dragonValues = { red: 5, green: 5, white: 5 };
    this.windValues = { east: 5, south: 5, west: 5, north: 5 };
    this.isGameOver = false;
    this.gameOverReason = '';
    this.drawNewHand();
  }

  // Navigate back to home
  exitGame() {
    this.router.navigate(['/']);
  }

  // Get tile symbol for display
  getTileSymbol(tile: Tile): string {
    if (tile.suit === 'bamboo') return '🎋';
    if (tile.suit === 'circle') return '⭕';
    if (tile.suit === 'character') return '字';
    if (tile.suit === 'wind') {
      const windSymbols: Record<WindType, string> = { east: '東', south: '南', west: '西', north: '北' };
      return windSymbols[tile.value as WindType];
    }
    if (tile.suit === 'dragon') {
      const dragonSymbols: Record<DragonType, string> = { red: '中', green: '發', white: '白' };
      return dragonSymbols[tile.value as DragonType];
    }
    return '?';
  }

  // Get tile color class
  getTileColorClass(tile: Tile): string {
    if (tile.suit === 'dragon') {
      if (tile.value === 'red') return 'tile-red';
      if (tile.value === 'green') return 'tile-green';
      return 'tile-white';
    }
    if (tile.suit === 'wind') return 'tile-wind';
    if (tile.suit === 'bamboo') return 'tile-bamboo';
    if (tile.suit === 'circle') return 'tile-circle';
    return 'tile-character';
  }
}