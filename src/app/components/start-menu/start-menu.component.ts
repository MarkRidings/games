import {Component} from '@angular/core';
import {GameFunctionsService} from '../../services/gameFunctions.service';
import {Constants} from '../../app.constants';

@Component({
  selector: 'game-start-menu',
  templateUrl: 'start-menu.component.html',
  styleUrls: ['start-menu.component.css']
})

export class StartMenuComponent {

  public gameType: string;
  public aiDiff: string;
  public humanAs: string;

  constructor(private gameFunctionsService: GameFunctionsService) { }

  startGame(): void {
    this.gameFunctionsService.startGame(this.gameType, this.aiDiff, this.humanAs);
  }

  disableButton(): boolean {
    return !this.gameType || (this.gameType === Constants.SINGLE_PLAYER && (!this.aiDiff || !this.humanAs));
  }

  showAiMenu(): boolean {
    return this.gameType && this.gameType === Constants.SINGLE_PLAYER;
  }
}
