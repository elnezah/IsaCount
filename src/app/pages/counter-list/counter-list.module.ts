import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CounterListPageRoutingModule } from './counter-list-routing.module';

import { CounterListPage } from './counter-list.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CounterListPageRoutingModule,
        ComponentsModule
    ],
  declarations: [CounterListPage]
})
export class CounterListPageModule {}
