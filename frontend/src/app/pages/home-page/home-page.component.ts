import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameApiService } from '../../services/game-api.service';

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  private router = inject(Router);
  private gameApi = inject(GameApiService);

  mouseX = 0;
  mouseY = 0;
  
  leaderboard: LeaderboardEntry[] = [];

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  showNameModal = false;
  playerName = '';

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  getGlowStyle(): { [key: string]: string } {
    return {
      background: `radial-gradient(600px circle at ${this.mouseX}px ${this.mouseY}px, rgba(217, 4, 41, 0.15), transparent 40%)`
    };
  }

  getMedalClass(rank: number): string {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return '';
    }
  }

  getMedalIcon(rank: number): string {
    switch (rank) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return rank.toString();
    }
  }

// startNewGame(): void {
//   const playerName = prompt('Enter your name:')?.trim();

//   if (!playerName) {
//     return;
//   }

//   this.gameApi.startGame(playerName).subscribe({
//     next: (game) => {
//       this.router.navigate(['/game', game._id]);
//     },
//     error: (err) => {
//       console.error('Failed to start game', err);
//     }
//   });
// }

  loadLeaderboard(): void {
    this.gameApi.getLeaderboard().subscribe({
      next: (data: any) => {
        this.leaderboard = data.map((item: any, index: number) => ({
          rank: index + 1,
          player: item.playerName || `Player ${index + 1}`,
          score: item.score
        }));
      },
      error: (err) => {
        console.error('Failed to load leaderboard', err);
      }
    });
  }

  openNameModal(): void {
    this.playerName = '';
    this.showNameModal = true;
  }

  closeNameModal(): void {
    this.showNameModal = false;
  }
  
  confirmStartGame(): void {
    const name = this.playerName.trim();
    if (name) {
      this.gameApi.startGame(name).subscribe({
        next: (game) => {
          this.showNameModal = false;
          this.router.navigate(['/game', game._id]);
        },
        error: (err) => {
          console.error('Failed to start game', err);
        }
      });
    }
}}