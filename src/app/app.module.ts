import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {GameBoardComponent} from "./components/game-board/game-board.component";
import {GameStateStore} from './stores/gameState.store';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GameStateStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
