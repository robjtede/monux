import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgReduxModule, NgRedux } from '@angular-redux/store'

import reducer from './reducers'
import middleware from './middleware'
import { IState } from './store'

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
  constructor(private ngRedux: NgRedux<IState>) {
    this.ngRedux.configureStore(reducer, {} as IState, middleware)
  }
}
