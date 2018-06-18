import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { TransactionPaneComponent } from './components/transaction-pane.component'
import { SpendingPaneComponent } from './components/spending-pane.component'
import { MapPaneComponent } from './components/map-pane.component'
import { ExportPaneComponent } from './components/export-pane.component'

const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionPaneComponent
  },
  {
    path: 'spending',
    component: SpendingPaneComponent
  },
  {
    path: 'map',
    component: MapPaneComponent
  },
  {
    path: 'export',
    component: ExportPaneComponent
  },
  {
    path: '',
    redirectTo: 'transactions',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'transactions',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingComponents = [
  TransactionPaneComponent,
  SpendingPaneComponent,
  MapPaneComponent,
  ExportPaneComponent
]
