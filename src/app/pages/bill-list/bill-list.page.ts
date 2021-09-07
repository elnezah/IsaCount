import { Component, NgZone, OnInit } from '@angular/core';
import { Bill, DataRepositoryService } from '../../services/data-repository.service';
import { ModalController } from '@ionic/angular';
import { BillEditorComponent } from '../../components/bill-editor/bill-editor.component';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.page.html',
  styleUrls: ['./bill-list.page.scss'],
})
export class BillListPage implements OnInit {
  private static readonly TAG = 'BillListPage';

  public billList: Bill[];

  public constructor(private modalController: ModalController,
                     private ngZone: NgZone,
                     private repo: DataRepositoryService) {
  }

  public async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  // region Listeners
  public async onClickOnBillListElement(bill: Bill): Promise<void> {
    await this.openEditor(bill);
  }

  public async onClickOnAddBill(): Promise<void> {
    const newBill: Bill = {
      id: -1,
      createdAt: dayjs(),
      lastUpdate: dayjs(),
      meta: null,
      name: null,
      description: null,
      currency: '€',
      imageUri: null,
      geoCoordinates: null,
      dateTime: dayjs()
    };

    const r = await this.openEditor(newBill);
    console.log(BillListPage.TAG, 'onClickOnAddBill', {r});
    if (r?.role === 'save') {
      await this.repo.createBill(newBill);
    }
    await this.refresh();
  }

  // endregion

  private async refresh(): Promise<void> {
    const s = this.repo.getDbState().subscribe(async dbReady => {
      console.log(BillListPage.TAG, 'refresh', {dbReady});
      if (dbReady) {
        this.billList = await this.repo.getAllBills();
        console.log(BillListPage.TAG, 'refresh', {billList: this.billList});
        s.unsubscribe();
      }
    });
  }

  private async openEditor(bill: Bill): Promise<any> {
    const modal = await this.modalController.create({
      component: BillEditorComponent,
      componentProps: {bill}
    });
    await modal.present();

    return await modal.onDidDismiss();
  }
}
