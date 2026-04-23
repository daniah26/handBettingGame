import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api';

  startGame(): Observable<any> {
    return this.http.post(`${this.baseUrl}/game/start`, {});
  }

  makeBet(gameId: string, betChoice: 'Higher' | 'Lower'): Observable<any> {
    return this.http.post(`${this.baseUrl}/game/bet`, {
      gameId,
      betChoice
    });
  }

  getGame(gameId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/game/${gameId}`);
  }

  getLeaderboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/leaderboard`);
  }
}