import {Injectable} from '@angular/core';
import {ComputerAiService} from './computerAi.service';
import {GameStateStore} from '../stores/gameState.store';
import {Constants} from '../app.constants';

@Injectable()
export class GameFunctionsService {

  constructor(private aiService: ComputerAiService, private gameStateStore: GameStateStore) { }

  newGame(): void {
    this.gameStateStore.refreshState(Constants.SINGLE_PLAYER, '', Constants.NO_PLAYER);
  }

  startGame(gameType: string, aiDiff: string, humanAs: string): void {

    this.gameStateStore.refreshState(gameType, aiDiff, humanAs);
    if (this.gameStateStore.getGameType() === Constants.SINGLE_PLAYER && this.gameStateStore.getHumanAs() === Constants.PLAYER_O) {
      this.makeAiMove();
    }
  }

  makePlayerMove(rowNumber: number, colNumber: number): void {

    if (this.gameStateStore.isHumansTurn() && this.gameStateStore.isCellEmpty(rowNumber, colNumber)) {
      this.gameStateStore.updateGameBoard(rowNumber, colNumber);

      if (this.checkForWinner()) {
        this.gameStateStore.markGameAsOver();
        alert(`Winner: ${this.gameStateStore.getCurrentPlayer()}`);
      }
      else {
        this.gameStateStore.updateNextPlayer();
        if (this.gameStateStore.getGameType() === Constants.SINGLE_PLAYER) {
          this.makeAiMove();
        }
      }
    }
  }

  makeAiMove(): void {
    const aiMove = (this.gameStateStore.getAiDifficulty() === Constants.AI_EASY) ?
      this.aiService.makeEasyMove(this.gameStateStore.getGameBoard()) :
      this.aiService.makeHardMove(this.gameStateStore.getGameBoard());

    if (aiMove[0] === -1) {
      setTimeout(this.announceTie, 500);
      this.gameStateStore.markGameAsOver();
      return;
    }

    this.gameStateStore.updateGameBoard(aiMove[0], aiMove[1]);

    if (!this.checkForWinner()) {
      if (!this.checkForTie()) {
        this.gameStateStore.updateNextPlayer();
      }
      else {
        this.gameStateStore.markGameAsOver();
        setTimeout(this.announceTie(), 500);
      }
    }
    else {
      this.gameStateStore.markGameAsOver();
      alert(`Winner: ${this.gameStateStore.getComputerAs()}`);
    }
  }

  announceTie(): void {
    alert('Tie Game');
  }

  checkForWinner(): boolean {
    return this.checkRows() || this.checkCols() || this.checkDiags();
  }

  checkForTie(): boolean {
    return false;
  }

  checkRows(): boolean {
    for (let i = 0; i < Constants.NUM_ROWS; i++) {
      if (this.lineCheck(this.gameStateStore.getRow(i))) {
        return true;
      }
    }

    return false;
  }

  checkCols(): boolean {
    for (let i = 0; i < Constants.NUM_COLS; i++) {
      const col = this.gameStateStore.getRows().map(row => row[i]);
      if (this.lineCheck(col)) {
        return true;
      }
    }

    return false;
  }

  checkDiags(): boolean {
    const diag1 = this.gameStateStore.getRows().map((row, index) => row[index]);
    const diag2 = this.gameStateStore.getRows().map((row, index) => row[row.length - 1 - index]);

    return this.lineCheck(diag1) || this.lineCheck(diag2);
  }

  lineCheck(line: string[]): boolean {
    return line.filter(cell => cell !== Constants.NO_PLAYER && cell === line[0]).length === line.length;
  }
}

