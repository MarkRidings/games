import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {GameBoardComponent} from './components/game-board/game-board.component';
import {GameStateStore} from './stores/gameState.store';
import {StartMenuComponent} from './components/start-menu/start-menu.component';
import {GameFunctionsService} from './services/gameFunctions.service';
import {ComputerAiService} from './services/computerAi.service';
import {FormsModule} from '@angular/forms';
import {RowComponent} from './components/row/row.component';
import {CellComponent} from './components/cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    StartMenuComponent,
    RowComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    GameStateStore,
    GameFunctionsService,
    ComputerAiService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
