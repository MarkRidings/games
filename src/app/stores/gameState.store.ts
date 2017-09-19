
import {Constants} from '../app.constants';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
class GameState {

  gameType: string;
  aiDiff: string;
  humanAs: string;
  computerAs: string;
  currentPlayer: string;
  inProgress: boolean;
  rows: string[][];

  constructor() {
    this.gameType = Constants.TWO_PLAYER;
    this.aiDiff = '';
    this.humanAs = Constants.NO_PLAYER;
    this.computerAs = Constants.NO_PLAYER;
    this.currentPlayer = Constants.NO_PLAYER;
    this.inProgress = false;
    this.clearRows();
  }

  init(gameType: string,  aiDiff: string,  humanAs: string): void {
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

    this.computerAs = this.humanAs === Constants.PLAYER_X ? Constants.PLAYER_O : Constants.PLAYER_X;
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

  refreshState(gameType: string,  aiDiff: string,  humanAs: string): void {
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

  getGameBoard(): string[][] {
    return this.gameState.rows;
  }

  getCurrentPlayer(): string {
    return this.gameState.currentPlayer;
  }

  getGameType(): string {
    return this.gameState.gameType;
  }

  getHumanAs(): string {
    return this.gameState.humanAs;
  }

  getComputerAs(): string {
    return this.gameState.computerAs;
  }

  getAiDifficulty(): string {
    return this.gameState.aiDiff;
  }

  getRows(): string[][] {
    return this.gameState.rows;
  }

  getRow(rowIndex: number): string[] {
    return this.gameState.rows[rowIndex];
  }

  updateGameState(): void {
    this.gameState$.next(this.gameState);
  }

  updateGameBoard(rowIndex: number, colIndex: number): void {
    this.gameState.rows[rowIndex][colIndex] = this.gameState.currentPlayer;
    this.updateGameState();
  }

  updateNextPlayer(): void {
    this.gameState.currentPlayer = this.gameState.currentPlayer === Constants.PLAYER_X ?
                                    Constants.PLAYER_O : Constants.PLAYER_X;

    this.updateGameState();
  }

  markGameAsOver(): void {
    this.gameState.inProgress = false;
    this.updateGameState();
  }

  isHumansTurn(): boolean {
    return this.gameState.gameType === Constants.TWO_PLAYER ||
           this.gameState.currentPlayer === this.gameState.humanAs;
  }

  isCellEmpty(rowIndex: number, colIndex: number): boolean {
    return this.gameState.rows[rowIndex][colIndex] === Constants.NO_PLAYER;
  }
}
