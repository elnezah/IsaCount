import { Component, OnInit } from '@angular/core';
import { Bill, DataRepositoryService } from "../../services/data-repository.service";
import { ModalController } from "@ionic/angular";
import { BillEditorComponent } from "../../components/bill-editor/bill-editor.component";
import * as dayjs from "dayjs";

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.page.html',
  styleUrls: ['./bill-list.page.scss'],
})
export class BillListPage implements OnInit {
  private static readonly TAG = 'BillListPage';

  public billList: Bill[];

  public constructor(private modalController: ModalController,
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

    await this.openEditor(newBill);
    await this.repo.createBill(newBill);
  }

  // endregion

  private async refresh(): Promise<void> {
     this.billList = await this.repo.getAllBills();
  }

  private async openEditor(bill: Bill): Promise<void> {
    const modal = await this.modalController.create({
      component: BillEditorComponent,
      componentProps: {bill}
    });
    await modal.present();

    const r = await modal.onDidDismiss();
    console.log(BillListPage.TAG, 'openEditor', {r});
  }
}
