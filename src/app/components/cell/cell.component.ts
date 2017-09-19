import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {GameFunctionsService} from '../../services/gameFunctions.service';
import {GameStateStore} from '../../stores/gameState.store';
import {Constants} from '../../app.constants';

@Component({
  selector: 'game-cell',
  templateUrl: 'cell.component.html',
  styleUrls: ['cell.component.css']
})

export class CellComponent implements OnInit {

  @Input() isCenter = false;
  @Input() rowNumber = 0;
  @Input() colNumber = 0;

  gameStateSubscription: Subscription;

  public cellValue = '';

  constructor(private gameFunctionsService: GameFunctionsService, private gameStateStore: GameStateStore) {}

  ngOnInit() {
    this.gameStateSubscription = this.gameStateStore.getAsObservable().subscribe(state => {
      switch (state.rows[this.rowNumber][this.colNumber]) {
        case Constants.PLAYER_X:
          this.cellValue = 'X';
          break;

        case Constants.PLAYER_O:
          this.cellValue = 'O';
          break;

        case Constants.NO_PLAYER:
          this.cellValue = '';
          break;
      }
    });
  }

  handleClick() {
    this.gameFunctionsService.makePlayerMove(this.rowNumber, this.colNumber);
  }
}
