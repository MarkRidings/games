import {Component, OnInit} from '@angular/core';
import {Constants} from '../../app.constants';
import {GameStateStore} from '../../stores/gameState.store';

@Component({
  selector: 'game-board',
  templateUrl: 'game-board.component.html'
})


export class GameBoardComponent implements  OnInit {

  public rowNumbers: number[];
  public gameInProgress = false;
  public gameOver = true;

  constructor(private gamesStateStore: GameStateStore) {
    this.rowNumbers = Array.from(Array(Constants.NUM_ROWS).keys());
  }

  ngOnInit() {
    this.gamesStateStore.getAsObservable().subscribe(state => {
      this.gameInProgress = state.currentPlayer !== Constants.NO_PLAYER;
      this.gameOver = !state.inProgress;
    });
  }

  restartGame(): void {
    this.gamesStateStore.restartGame();
  }

  backToMenu(): void {
    this.gamesStateStore.backToMenu();
  }

}
