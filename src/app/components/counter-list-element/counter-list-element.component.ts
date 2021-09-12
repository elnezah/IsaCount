import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bill, Counter, DataRepositoryService } from '../../services/data-repository.service';

@Component({
  selector: 'app-counter-list-element',
  templateUrl: './counter-list-element.component.html',
  styleUrls: ['./counter-list-element.component.scss'],
})
export class CounterListElementComponent implements OnInit {
  private static readonly TAG = 'CounterListElementComponent';

  @Input() counter: Counter;

  @Output() clickOnDetails = new EventEmitter<void>();
  @Output() counterCountChange = new EventEmitter<number>();

  public bill: Bill;

  public constructor(private repo: DataRepositoryService) {
  }

  public async ngOnInit(): Promise<void> {
    this.bill = await this.repo.getBillForId(this.counter.bill);
  }

  public onClickOnDetails(): void {
    this.clickOnDetails.emit();
  }

  public onCounterValueChange($event: number): void {
    this.counterCountChange.emit($event);
  }
}
