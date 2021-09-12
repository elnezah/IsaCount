import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillListPageRoutingModule } from './bill-list-routing.module';

import { BillListPage } from './bill-list.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BillListPageRoutingModule,
        ComponentsModule
    ],
  declarations: [BillListPage]
})
export class BillListPageModule {}
