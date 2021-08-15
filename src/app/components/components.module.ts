import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BillEditorComponent } from './bill-editor/bill-editor.component';
import { BillListElementComponent } from './bill-list-element/bill-list-element.component';
import { CounterEditorComponent } from './counter-editor/counter-editor.component';
import { CounterListElementComponent } from './counter-list-element/counter-list-element.component';
import { FormsModule } from "@angular/forms";

@NgModule(
    {
      imports: [
        CommonModule,
        IonicModule,
        FormsModule,
      ],
        declarations: [
          BillEditorComponent,
          BillListElementComponent,
          CounterEditorComponent,
          CounterListElementComponent
        ],
        exports: [
          BillEditorComponent,
          BillListElementComponent,
          CounterEditorComponent,
          CounterListElementComponent
        ]
    }
)

export class ComponentsModule {
}
