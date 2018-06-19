import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// routable components
import { LoginComponent } from './components/login.component'
import { AppComponent } from './components/app.component'
import { TransactionPaneComponent } from './components/transaction-pane.component'
import { SpendingPaneComponent } from './components/spending-pane.component'
import { MapPaneComponent } from './components/map-pane.component'
import { ExportPaneComponent } from './components/export-pane.component'

// guards
import { ApiAccessGuard } from './guards/api-access.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/(pane:transactions)',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'app',
    component: AppComponent,
    children: [
      {
        outlet: 'pane',
        path: 'transactions',
        component: TransactionPaneComponent
      },
      {
        outlet: 'pane',
        path: 'spending',
        component: SpendingPaneComponent
      },
      {
        outlet: 'pane',
        path: 'map',
        component: MapPaneComponent
      },
      {
        outlet: 'pane',
        path: 'export',
        component: ExportPaneComponent
      }
    ]
  }
  // {
  //   path: '**',
  //   redirectTo: 'app'
  // }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingComponents = [
  LoginComponent,
  AppComponent,
  TransactionPaneComponent,
  SpendingPaneComponent,
  MapPaneComponent,
  ExportPaneComponent
]
