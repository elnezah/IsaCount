import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bill-list',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'bill-list',
    loadChildren: () => import('./pages/bill-list/bill-list.module').then( m => m.BillListPageModule)
  },
  {
    path: 'counter-list',
    loadChildren: () => import('./pages/counter-list/counter-list.module').then( m => m.CounterListPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
