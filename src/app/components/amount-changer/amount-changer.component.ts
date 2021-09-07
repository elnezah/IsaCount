import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-amount-changer',
  templateUrl: './amount-changer.component.html',
  styleUrls: ['./amount-changer.component.scss'],
})
export class AmountChangerComponent implements OnInit {
  private static readonly TAG = 'AmountChangerComponent';

  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  onClickOnAdd(amount: number) {
    this.value += amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.valueChange.emit(this.value);
  }
}
