import {Component, OnInit} from '@angular/core';
import {Constants} from '../../app.constants';
import {GameStateStore} from '../../stores/gameState.store';
import {GameFunctionsService} from '../../services/gameFunctions.service';

@Component({
  selector: 'game-board',
  templateUrl: 'game-board.component.html',
  styleUrls: ['game-board.component.css']
})


export class GameBoardComponent implements  OnInit {

  public rowNumbers: number[];
  public gameInProgress = false;
  public gameOver = true;

  constructor(private gamesStateStore: GameStateStore, private gameFunctionService: GameFunctionsService) {
    this.rowNumbers = Array.from(Array(Constants.NUM_ROWS).keys());
  }

  ngOnInit() {
    this.gamesStateStore.getAsObservable().subscribe(state => {
      this.gameInProgress = state.currentPlayer !== Constants.NO_PLAYER;
      this.gameOver = !state.inProgress;
    });
  }

  restartGame(): void {
    this.gameFunctionService.restartGame();
  }

  backToMenu(): void {
    this.gamesStateStore.backToMenu();
  }

}
