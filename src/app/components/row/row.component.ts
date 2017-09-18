import {Component, Input} from '@angular/core';
import {Constants} from '../../app.constants';

@Component({
  selector: 'game-row',
  templateUrl: 'row.component.html',
  styleUrls: ['row.component.css']
})

export class RowComponent {

  @Input() isCenter = false;
  @Input() rowNumber: number;

  public colNumbers: number[];

  constructor() {
    this.colNumbers = Array.from(Array(Constants.NUM_COLS).keys());
  }
}
