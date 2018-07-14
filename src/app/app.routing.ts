import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// routable components
import { GetClientInfoComponent } from './components/get-client-info.component'
import { AuthRequestComponent } from './components/auth-request.component'
import { AppComponent } from './components/app.component'
import { TransactionPaneComponent } from './components/transaction-pane.component'
import { PotsPaneComponent } from './components/pots-pane.component'
import { SpendingPaneComponent } from './components/spending-pane.component'
import { MapPaneComponent } from './components/map-pane.component'
import { ExportPaneComponent } from './components/export-pane.component'
import { PathNotFoundComponent } from './components/path-not-found.component'

// guards
import { ApiAccessGuard } from './guards/api-access.guard'
import { ClientInfoGuard } from './guards/client-info.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/(pane:transactions)',
    pathMatch: 'full'
  },
  {
    path: 'get-client-info',
    component: GetClientInfoComponent
  },
  {
    path: 'auth-request',
    component: AuthRequestComponent,
    canActivate: [ClientInfoGuard]
  },
  {
    path: 'app',
    component: AppComponent,
    // canActivate: [ApiAccessGuard, ClientInfoGuard],
    children: [
      {
        path: '',
        redirectTo: '/app/(pane:transactions)',
        pathMatch: 'full'
      },
      {
        outlet: 'pane',
        path: 'transactions',
        component: TransactionPaneComponent
      },
      {
        outlet: 'pane',
        path: 'pots',
        component: PotsPaneComponent
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
      },
      {
        path: '**',
        redirectTo: '/app/(pane:transactions)',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    component: PathNotFoundComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routedComponents = [
  GetClientInfoComponent,
  AuthRequestComponent,
  AppComponent,
  TransactionPaneComponent,
  PotsPaneComponent,
  SpendingPaneComponent,
  MapPaneComponent,
  ExportPaneComponent,
  PathNotFoundComponent
]
