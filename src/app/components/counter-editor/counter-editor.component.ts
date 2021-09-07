import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../../services/data-repository.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-counter-editor',
  templateUrl: './counter-editor.component.html',
  styleUrls: ['./counter-editor.component.scss'],
})
export class CounterEditorComponent implements OnInit {
  private static readonly TAG = 'CounterEditorComponent';

  @Input() counter: Counter;

  constructor(private modalController: ModalController) {
  }

  public async ngOnInit(): Promise<void> {
    console.log(CounterEditorComponent.TAG, 'counter', this.counter);
  }

  public async onClickOnCancel(): Promise<void> {
    await this.modalController.dismiss(null, 'cancel');
  }

  public async onClickOnSave() : Promise<void>{
    await this.modalController.dismiss({counter: this.counter}, 'save');
  }
}
