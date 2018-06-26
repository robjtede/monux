import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { environment } from '../environments/environment'
import { AppModule } from './app.module'

import './style/index.css'

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  // disabled due to weak @anuglar/animations support
  // defaultEncapsulation: ViewEncapsulation.Native
})
