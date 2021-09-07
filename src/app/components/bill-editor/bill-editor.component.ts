import { Component, Input, OnInit } from '@angular/core';
import { Bill } from '../../services/data-repository.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bill-editor',
  templateUrl: './bill-editor.component.html',
  styleUrls: ['./bill-editor.component.scss'],
})
export class BillEditorComponent implements OnInit {
  private static readonly TAG = 'BillEditorComponent';

  @Input() bill: Bill;

  public constructor(private modalController: ModalController) {
  }

  public ngOnInit(): void {
    console.log(BillEditorComponent.TAG, 'ngOnInit', {bill: this.bill});
  }

  public async onClickOnCancel(): Promise<void> {
    await this.modalController.dismiss(null, 'cancel');
  }

  public async onClickOnSave(): Promise<void> {
    await this.modalController.dismiss({bill: this.bill}, 'save');
  }
}
