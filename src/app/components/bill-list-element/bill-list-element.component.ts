import { Component, Input, OnInit } from '@angular/core';
import { Bill, DataRepositoryService } from '../../services/data-repository.service';

@Component({
  selector: 'app-bill-list-element',
  templateUrl: './bill-list-element.component.html',
  styleUrls: ['./bill-list-element.component.scss'],
})
export class BillListElementComponent implements OnInit {
  private static readonly TAG = 'BillListElementComponent';

  @Input() bill: Bill;
 public total: number;

  public constructor(private repo: DataRepositoryService) {
  }

  public async ngOnInit(): Promise<void> {
    const counters = await this.repo.getCountersForBillId(this.bill.id);
    this.total = counters.reduce<number>((a, e) => a + e.price * e.count, 0);
  }

}
