import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CounterListPage } from './counter-list.page';

const routes: Routes = [
  {
    path: '',
    component: CounterListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounterListPageRoutingModule {}
