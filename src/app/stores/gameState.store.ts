
import {Constants} from '../app.constants';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
class GameState {

  gameType: number;
  aiDiff: string;
  humanAs: string;
  computerAs: string;
  currentPlayer: string;
  inProgress: boolean;
  rows: number[][];

  constructor() {
    this.gameType = 1;
    this.aiDiff = '';
    this.humanAs = Constants.NO_PLAYER;
    this.computerAs = Constants.NO_PLAYER;
    this.currentPlayer = Constants.NO_PLAYER;
    this.inProgress = false;
    this.clearRows();
  }

  init(gameType: number,  aiDiff: string,  humanAs: string): void {
    this.currentPlayer = Constants.PLAYER_X;
    this.gameType = gameType;
    this.aiDiff = aiDiff;

    if (humanAs === Constants.RANDOM_START) {
      this.humanAs = Math.random() >= 0.5 ?
        Constants.PLAYER_X : Constants.PLAYER_O;
    }
    else {
      this.humanAs = humanAs;
    }

    this.clearRows();
    this.inProgress = true;
  }

  clearRows() {
    this.rows = [];
    for (let i = 0; i < Constants.NUM_ROWS; i++) {
      const aux = Array(Constants.NUM_COLS).fill(Constants.NO_PLAYER);
      this.rows.push(aux);
    }
  }
}

@Injectable()
export class GameStateStore {
  private gameState: GameState;
  private gameState$: BehaviorSubject<GameState>;

  constructor() {
    this.gameState = new GameState();
    this.gameState$ = new BehaviorSubject<GameState>(this.gameState);
  }

  refreshState(gameType: number,  aiDiff: string,  humanAs: string): void {
    this.gameState.init(gameType,  aiDiff, humanAs);
    this.updateGameState();
  }

  backToMenu(): void {
    this.gameState.currentPlayer = Constants.NO_PLAYER;
    this.updateGameState();
  }

  restartGame(): void {
    this.gameState.init(this.gameState.gameType, this.gameState.aiDiff, this.gameState.humanAs);
    this.updateGameState();
  }

  getAsObservable(): Observable<GameState> {
    return this.gameState$.asObservable();
  }

  updateGameState(): void {
    this.gameState$.next(this.gameState);
  }
}
