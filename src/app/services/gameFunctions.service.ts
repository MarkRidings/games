import {Injectable} from '@angular/core';
import {ComputerAiService} from './computerAi.service';
import {GameStateStore} from '../stores/gameState.store';
import {Constants} from '../app.constants';

@Injectable()
export class GameFunctionsService {

  constructor(private aiService: ComputerAiService, private gameStateStore: GameStateStore) { }


  startGame(gameType: string, aiDiff: string, humanAs: string): void {

    this.gameStateStore.refreshState(gameType, aiDiff, humanAs);
    if (this.gameStateStore.getGameType() === Constants.SINGLE_PLAYER && this.gameStateStore.getHumanAs() === Constants.PLAYER_O) {
      this.makeAiMove();
    }
  }

  restartGame(): void {

    this.gameStateStore.restartGame();
    if (this.gameStateStore.getGameType() === Constants.SINGLE_PLAYER && this.gameStateStore.getHumanAs() === Constants.PLAYER_O) {
      this.makeAiMove();
    }
  }

  makePlayerMove(rowNumber: number, colNumber: number): void {

    if (this.gameStateStore.isHumansTurn() && this.gameStateStore.isCellEmpty(rowNumber, colNumber)) {
      this.gameStateStore.updateGameBoard(rowNumber, colNumber);

      if (this.checkForWinner()) {
        this.announceWinner();
      }
      else if (this.checkForTie()) {
        setTimeout(this.announceTie, 200);
        this.gameStateStore.markGameAsOver();
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
      setTimeout(this.announceTie, 150);
      this.gameStateStore.markGameAsOver();
      return;
    }

    this.gameStateStore.updateGameBoard(aiMove[0], aiMove[1]);

    if (!this.checkForWinner()) {
      if (!this.checkForTie()) {
        this.gameStateStore.updateNextPlayer();
      }
      else {
        setTimeout(this.announceTie, 150);
        this.gameStateStore.markGameAsOver();
      }
    }
    else {
      this.announceWinner();
      this.gameStateStore.markGameAsOver();
    }
  }

  announceTie(): void {
    alert('Tie Game');
  }

  announceWinner(): void {
    const message = `Winner: Player ${this.gameStateStore.getCurrentPlayer()}`;
    setTimeout(function () {
      alert(message);
    }, 150);

    this.gameStateStore.markGameAsOver();
  }

  checkForWinner(): boolean {
    return this.checkRows() || this.checkCols() || this.checkDiags();
  }

  checkForTie(): boolean {
    let cnt = 0;
    for (let i = 0; i < Constants.NUM_ROWS; i++) {
      cnt += this.gameStateStore.getRow(i).filter(x => x === Constants.NO_PLAYER).length;
    }

    return cnt === 0;
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

