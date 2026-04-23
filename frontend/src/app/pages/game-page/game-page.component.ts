import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameApiService } from '../../services/game-api.service';

type BetChoice = 'higher' | 'lower';
type BetResult = 'win' | 'lose' | null;

interface UiTile {
  label: string;
  type: 'number' | 'wind' | 'dragon';
  suit?: string;
  displayName: string;
  displayValue: number;
}

interface PreviousHandView {
  tiles: UiTile[];
  totalValue: number;
  bet: BetChoice;
  result: BetResult;
}

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameApi = inject(GameApiService);

  gameId = '';

  glowStyle: { [key: string]: string } = {};
  particles = Array.from({ length: 14 }, (_, i) => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: i * 0.6,
    size: 4 + Math.random() * 8
  }));

  score = 0;
  drawPileCount = 0;
  discardPileCount = 0;
  reshuffleCount = 0;
  maxReshuffles = 2;

  currentHand: UiTile[] = [];
  currentHandValue = 0;

  previousHand: PreviousHandView | null = null;

  isRevealing = false;
  showResult = false;
  lastBetResult: BetResult = null;

  isGameOver = false;
  gameOverReason = '';

  dragonValues = {
    red: 5,
    green: 5,
    white: 5
  };

  windValues = {
    east: 5,
    south: 5,
    west: 5,
    north: 5
  };

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.gameId) {
      this.router.navigate(['/']);
      return;
    }

    this.loadGame();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.glowStyle = {
      background: `radial-gradient(600px circle at ${event.clientX}px ${event.clientY}px, rgba(217, 4, 41, 0.14), transparent 40%)`
    };
  }

  loadGame(): void {
    this.gameApi.getGame(this.gameId).subscribe({
      next: (game) => {
        this.applyGameState(game, false);
      },
      error: (err) => {
        console.error('Failed to load game', err);
      }
    });
  }

  placeBet(choice: BetChoice): void {
    if (this.isRevealing || this.isGameOver) return;

    this.isRevealing = true;
    this.showResult = false;

    const backendChoice = choice === 'higher' ? 'Higher' : 'Lower';

    this.gameApi.makeBet(this.gameId, backendChoice).subscribe({
      next: (updatedGame) => {
        this.applyGameState(updatedGame, true, choice);
      },
      error: (err) => {
        console.error('Bet failed', err);
        this.isRevealing = false;
      }
    });
  }

  restartGame(): void {
    this.gameApi.startGame().subscribe({
      next: (newGame) => {
        this.router.navigate(['/game', newGame._id]);
      },
      error: (err) => {
        console.error('Failed to restart game', err);
      }
    });
  }

  exitGame(): void {
    this.router.navigate(['/']);
  }

  private applyGameState(game: any, fromBet: boolean, placedBet?: BetChoice): void {
    this.score = game.score ?? 0;
    this.drawPileCount = game.drawPile?.length ?? 0;
    this.discardPileCount = game.discardPile?.length ?? 0;
    this.reshuffleCount = game.drawPileEmptyCount ?? 0;

    this.currentHand = this.mapTiles(game.previousHand?.tiles || []);
    this.currentHandValue = game.previousHand?.totalValue ?? 0;

    this.windValues = {
      east: game.tileValues?.eastWind ?? 5,
      south: game.tileValues?.southWind ?? 5,
      west: game.tileValues?.westWind ?? 5,
      north: game.tileValues?.northWind ?? 5
    };

    this.dragonValues = {
      red: game.tileValues?.redDragon ?? 5,
      green: game.tileValues?.greenDragon ?? 5,
      white: game.tileValues?.whiteDragon ?? 5
    };

    this.isGameOver = !!game.gameOver;
    this.gameOverReason = game.gameOverReason || '';

    if (game.history?.length) {
      const latestHistory = game.history[0];

      this.previousHand = {
        tiles: this.mapTiles(latestHistory.tiles || []),
        totalValue: latestHistory.total ?? 0,
        bet: placedBet ?? this.mapBetFromBackend(game.lastBet),
        result: this.mapResult(game.betCorrect)
      };
    } else {
      this.previousHand = null;
    }

    this.lastBetResult = fromBet ? this.mapResult(game.betCorrect) : null;
    this.showResult = fromBet;
    this.isRevealing = false;
  }

  private mapTiles(tiles: any[]): UiTile[] {
    return tiles.map((tile) => ({
      label: tile.label,
      type: tile.type,
      suit: tile.suit,
      displayName: this.getDisplayName(tile),
      displayValue: tile.value
    }));
  }

  private getDisplayName(tile: any): string {
    if (tile.type === 'number') {
      return `${tile.label} ${tile.suit ?? ''}`.trim();
    }

    return tile.label;
  }

  private mapBetFromBackend(lastBet: string | null): BetChoice {
    return lastBet === 'Higher' ? 'higher' : 'lower';
  }

  private mapResult(betCorrect: boolean): BetResult {
    return betCorrect ? 'win' : 'lose';
  }

  getTileColorClass(tile: UiTile): string {
    if (tile.type === 'dragon') {
      if (tile.label === 'Red') return 'tile-red';
      if (tile.label === 'Green') return 'tile-green';
      return 'tile-white';
    }

    if (tile.type === 'wind') {
      return 'tile-wind';
    }

    if (tile.suit === 'dots') return 'tile-dots';
    if (tile.suit === 'bamboo') return 'tile-bamboo';
    return 'tile-characters';
  }

  getTileSymbol(tile: UiTile): string {
    if (tile.type === 'dragon') {
      if (tile.label === 'Red') return '中';
      if (tile.label === 'Green') return '發';
      return '白';
    }

    if (tile.type === 'wind') {
      if (tile.label === 'East') return '東';
      if (tile.label === 'South') return '南';
      if (tile.label === 'West') return '西';
      return '北';
    }

    return tile.label;
  }
}