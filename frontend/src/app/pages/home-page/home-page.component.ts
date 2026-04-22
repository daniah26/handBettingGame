import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  mouseX = 0;
  mouseY = 0;
  
  leaderboard: LeaderboardEntry[] = [
    { rank: 1, player: 'dania', score: 8 },
    { rank: 2, player: 'alex', score: 7 },
    { rank: 3, player: 'jordan', score: 6 },
    { rank: 4, player: 'casey', score: 5 },
    { rank: 5, player: 'morgan', score: 4 }
  ];

  ngOnInit(): void {}

  constructor(private router: Router) {}

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

  startNewGame(): void {
    this.router.navigate(['/game']);
  }
}