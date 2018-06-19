import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// routable components
import { AuthRequestComponent } from './components/auth-request.component'
import { AppComponent } from './components/app.component'
import { TransactionPaneComponent } from './components/transaction-pane.component'
import { SpendingPaneComponent } from './components/spending-pane.component'
import { MapPaneComponent } from './components/map-pane.component'
import { ExportPaneComponent } from './components/export-pane.component'
import { PathNotFoundComponent } from './components/path-not-found.component'

// guards
import { ApiAccessGuard } from './guards/api-access.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/(pane:transactions)',
    pathMatch: 'full'
  },
  {
    path: 'auth-request',
    component: AuthRequestComponent
  },
  {
    path: 'app',
    component: AppComponent,
    canActivate: [ApiAccessGuard],
    canActivateChild: [ApiAccessGuard],
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
export const routingComponents = [
  AuthRequestComponent,
  AppComponent,
  TransactionPaneComponent,
  SpendingPaneComponent,
  MapPaneComponent,
  ExportPaneComponent,
  PathNotFoundComponent
]
