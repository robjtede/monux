import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { TransactionPaneComponent } from './components/transaction-pane.component'
import { SpendingPaneComponent } from './components/spending-pane.component'

const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionPaneComponent
  },
  {
    path: 'spending',
    component: SpendingPaneComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingComponents = [
  TransactionPaneComponent,
  SpendingPaneComponent
]
