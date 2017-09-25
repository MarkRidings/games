import {Injectable} from '@angular/core';
import {Constants} from '../app.constants';

@Injectable()
export class ComputerAiService {

  makeEasyMove(gameBoard: string[][]): [number, number] {
    return this.randomMove(gameBoard);
  }

  makeMediumMove(gameBoard: string[][]): [number, number] {
    const potWinner = this.checkPotentialWinner(gameBoard);

    if (potWinner[0] !== -1) {
      return potWinner;
    }

    return this.randomMove(gameBoard);
  }

  makeHardMove(gameBoard: string[][]): [number, number] {

    // always go center if available
    if (gameBoard[1][1] === Constants.NO_PLAYER) {
      return [1, 1];
    }

    const potWinner = this.checkPotentialWinner(gameBoard);
    if (potWinner[0] !== -1) {
      return potWinner;
    }

    const numMoves = this.computeMovesMade(gameBoard);
    if (numMoves === 1) {
      return [0, 2];
    }

    if (numMoves === 2) {
      const oLocation = this.oFindLocation(gameBoard);
      if ((oLocation[0] === 0 || oLocation[0] === 2) && (oLocation[1] === 0 || oLocation[1] === 2)) {
        return [2 - oLocation[0], 2 - oLocation[1]];
      }

      return [2, 0];
    }

    if (numMoves === 3) {
      const oLocation = this.oFindLocation(gameBoard);
      if (gameBoard[oLocation[0]][2 - oLocation[1]] === Constants.NO_PLAYER) {
        return [oLocation[0], 2 - oLocation[1]];
      }
    }

    return this.randomMove(gameBoard);
  }

  checkPotentialWinner(gameBoard: string[][]): [number, number] {
    const rowCheck = this.checkRows(gameBoard);
    if (rowCheck[0] !== -1) {
      return rowCheck;
    }

    const colCheck = this.checkColumns(gameBoard);
    if (colCheck[0] !== -1) {
      return colCheck;
    }

    const diagCheck = this.checkDiags(gameBoard);
    if (diagCheck[0] !== -1) {
      return diagCheck;
    }

    return [-1, -1];
  }

  checkColumns(gameBoard: string[][]): [number, number] {

    for (let i = 0; i < Constants.NUM_COLS; i++) {
      const col = gameBoard.map(row => row[i]);
      const rowIndex = this.checkLine(col);
      if (rowIndex !== -1) {
        return [rowIndex, i];
      }
    }

    return [-1, -1];
  }

  checkRows(gameBoard: string[][]): [number, number] {
    for (let i = 0; i < Constants.NUM_ROWS; i++) {
      const colIndex = this.checkLine(gameBoard[i]);
      if (colIndex !== -1) {
        return [i, colIndex];
      }
    }

    return [-1, -1];
  }

  checkDiags(gameBoard: string[][]): [number, number] {
    const diag1 = gameBoard.map((row, index) => row[index]);
    let diagIndex = this.checkLine(diag1);
    if (diagIndex !== -1) {
      return [diagIndex, diagIndex];
    }

    const diag2 = gameBoard.map((row, index) => row[row.length - 1 - index]);
    diagIndex = this.checkLine(diag2);
    if (diagIndex !== -1) {
      return [diagIndex, Constants.NUM_ROWS - 1 - diagIndex];
    }

    return [-1, -1];
  }

  checkLine(line: string[]): number {
    if (line.filter(x => x === Constants.NO_PLAYER).length === 1) {
      if (line.filter(x => x === Constants.PLAYER_X).length === 2 ||
          line.filter(x => x === Constants.PLAYER_O).length === 2) {
        return line.indexOf(Constants.NO_PLAYER);
      }
      return -1;
    }

    return -1;
  }

  computeMovesMade(gameBoard: string[][]): number {
    let cnt = 0;
    for (let i = 0; i < Constants.NUM_ROWS; i++) {
      cnt += gameBoard[i].filter(x => x !== Constants.NO_PLAYER).length;
    }

    return cnt;
  }


  // this finds the location of the first Player_O move
  // it is called knowing that the player has only played once
  oFindLocation(gameBoad: string[][]): [number, number] {
    for (let i = 0; i < Constants.NUM_ROWS; i++) {
      const idx = gameBoad[i].indexOf(Constants.PLAYER_O);
      if (idx !== -1) {
        return [i, idx];
      }
    }

    return [-1, -1];
  }

  randomMove(gameBoard: string[][]): [number, number] {
    const selections = [];
    while (selections.length < 9) {
      const aux = Math.round(Math.random() * 8);
      if (selections.indexOf(aux) !== -1) {
        continue;
      }

      selections.push(aux);

      const rowIndex = Math.trunc(aux / Constants.NUM_ROWS);
      const colIndex = aux % Constants.NUM_COLS;
      if (gameBoard[rowIndex][colIndex] === Constants.NO_PLAYER) {
        return [rowIndex, colIndex];
      }
    }

    // if we make it here, all squares have been selected
    return [-1, -1];
  }
}
