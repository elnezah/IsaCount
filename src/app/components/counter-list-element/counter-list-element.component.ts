import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../../services/data-repository.service';

@Component({
  selector: 'app-counter-list-element',
  templateUrl: './counter-list-element.component.html',
  styleUrls: ['./counter-list-element.component.scss'],
})
export class CounterListElementComponent implements OnInit {
  private static readonly TAG = 'CounterListElementComponent';

  @Input() counter: Counter;

  public constructor() {
  }

  public ngOnInit(): void {
  }

}
