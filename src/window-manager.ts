import { resolve } from 'path'
import {
  // URL,
  format
} from 'url'
import Debug = require('debug')

import { BrowserWindow, Menu } from 'electron'
import windowState = require('electron-window-state')

import { makeMacOSMenu } from './menu-template'

const debug = Debug('app:window-manager')

export class WindowManager {
  private _window: BrowserWindow | undefined

  focus() {
    if (this._window) this._window.focus()
  }

  get hasWindow(): boolean {
    return !!this._window
  }

  get window(): BrowserWindow {
    debug('get window')
    if (this._window) return this._window

    const mainWindowState = windowState({
      defaultHeight: 800,
      defaultWidth: 1000
    })

    this._window = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      minWidth: 600,
      minHeight: 600,
      titleBarStyle: 'hiddenInset'
    })

    mainWindowState.manage(this._window)

    this._window.on('closed', () => {
      this._window = undefined
    })

    return this._window
  }

  set location(path: string) {
    debug('set window location =>', path)
    this.window.loadURL(path)
  }

  set menu(menu: Electron.MenuItemConstructorOptions[]) {
    debug('set menu')
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  }

  setDefaultMenu(): void {
    debug('set default menu')
    this.menu = makeMacOSMenu(this.window)
  }

  goToMonux(): void {
    debug('go to monux')
    this.location = format({
      pathname: resolve(__dirname, 'app', 'index.html'),
      protocol: 'file:'
    })
    this.setDefaultMenu()
  }

  // goToAuthRequest(appInfo: AppInfo): void {
  //   debug('go to auth request')
  //   const url = new URL('https://auth.monzo.com/')
  //   url.searchParams.set('client_id', appInfo.client_id)
  //   url.searchParams.set('redirect_uri', appInfo.redirect_uri)
  //   url.searchParams.set('response_type', appInfo.response_type)
  //   url.searchParams.set('state', appInfo.state)

  //   this.location = url.toString()

  //   this.setDefaultMenu()
  // }

  // goToClientInfo(): void {
  //   debug('go to client info')
  //   this.location = format({
  //     pathname: resolve(__dirname, 'app', 'get-client-info.html'),
  //     protocol: 'file:',
  //   })
  //   this.setDefaultMenu()
  // }
}
