import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CounterListPageRoutingModule } from './counter-list-routing.module';

import { CounterListPage } from './counter-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CounterListPageRoutingModule
  ],
  declarations: [CounterListPage]
})
export class CounterListPageModule {}
