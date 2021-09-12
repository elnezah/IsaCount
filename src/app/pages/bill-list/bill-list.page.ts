import { Component, NgZone, OnInit } from '@angular/core';
import { Bill, DataRepositoryService } from '../../services/data-repository.service';
import { AlertController, ModalController } from '@ionic/angular';
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

  public constructor(private alertController: AlertController,
                     private modalController: ModalController,
                     private ngZone: NgZone,
                     private repo: DataRepositoryService) {
  }

  public async ngOnInit(): Promise<void> {
  }

  public async ionViewDidEnter(): Promise<void> {
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

  public async onClickOnDeleteBill(bill: Bill): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Deleting a bill cannot be undone. Do you still want to delete it?',
      buttons: [
        {
          text: 'Yes, delete',
          role: 'delete'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();

    const r = await alert.onDidDismiss();

    if (r.role === 'delete') {
      await this.repo.deleteBill(bill);
      await this.refresh();
    }
  }

  public async onClickOnEditBill(bill: Bill): Promise<void> {
    const r = await this.openEditor(bill);

    if (r.role === 'save') {
      await this.repo.updateBill(bill);
      await this.refresh();
    }
  }

  // endregion

  private async refresh(): Promise<void> {
    const s = this.repo.getDbState().subscribe(async dbReady => {
      if (dbReady) {
        this.billList = await this.repo.getAllBills();
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
