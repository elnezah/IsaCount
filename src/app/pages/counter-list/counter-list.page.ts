import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bill, Counter, DataRepositoryService } from '../../services/data-repository.service';
import { ModalController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { CounterEditorComponent } from '../../components/counter-editor/counter-editor.component';

@Component({
  selector: 'app-counter-list',
  templateUrl: './counter-list.page.html',
  styleUrls: ['./counter-list.page.scss'],
})
export class CounterListPage implements OnInit {
  private static readonly TAG = 'CounterListPage';

  public bill: Bill;
  public counters: Counter[];

  constructor(private repo: DataRepositoryService,
              private route: ActivatedRoute,
              private modalController: ModalController) {
  }

  public async ngOnInit(): Promise<void> {
    try {
      const paramMap = this.route.snapshot.paramMap;
      const billId = Number.parseInt(paramMap.get('billId'), 10);
      const mSub = this.repo.getDbState().subscribe(async s => {
        if (s) {
          this.bill = await this.repo.getBillForId(billId);
          this.counters = await this.repo.getCountersForBillId(billId);
          console.log(CounterListPage.TAG, {counters: this.counters, bill: this.bill});
          mSub.unsubscribe();
        }
      });
    } catch (e) {
      console.error(CounterListPage.TAG, 'error on init', e);
    }
  }

  public async onClickOnAddCounter(): Promise<void> {
    const newCounter: Counter = {
      id: -1,
      bill: this.bill.id,
      createdAt: dayjs(),
      lastUpdate: dayjs(),
      meta: null,
      name: null,
      count: 0,
      description: null,
      imageUri: null,
      price: 0,
    };

    const r = await this.openEditor(newCounter);
    if (r?.role === 'save') {
      await this.repo.createCounter(newCounter);
    }

    await this.refresh();
  }

  private async refresh(): Promise<void> {
    this.counters = await this.repo.getCountersForBillId(this.bill.id);
  }

  private async openEditor(counter: Counter): Promise<any> {
    const modal = await this.modalController.create({
      component: CounterEditorComponent,
      componentProps: {counter}
    });
    await modal.present();

    return await modal.onDidDismiss();
  }
}
