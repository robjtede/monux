import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgReduxModule } from '@angular-redux/store'

import { AppComponent } from './app.component'
import { AmountComponent } from './components/amount.component'
import { AccountComponent } from './components/account.component'

@NgModule({
  declarations: [AppComponent, AmountComponent, AccountComponent],
  imports: [BrowserModule, NgReduxModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(ngRedux: NgRedux<IState>) {
  //   ngRedux.provideStore(store)
  // }
}
