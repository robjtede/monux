import { resolve } from 'path'
import { format } from 'url'
import * as Debug from 'debug'

import { BrowserWindow, Menu } from 'electron'
import windowState = require('electron-window-state')

import { oneLineTrim } from 'common-tags'

import { AppInfo } from './app'
import { macOSMenu } from './menu-template'

const debug = Debug('app:window-manager')

export class WindowManager {
  private _window: Electron.BrowserWindow | undefined

  focus() {
    if (this._window) this._window.focus()
  }

  get hasWindow(): boolean {
    return !!this._window
  }

  get window(): Electron.BrowserWindow {
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
      titleBarStyle: 'hidden-inset',
      webPreferences: {
        experimentalFeatures: true
      }
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
    this.menu = macOSMenu
  }

  goToMonux(): void {
    debug('go to monux')
    this.location = format({
      pathname: resolve(__dirname, 'app', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
    this.setDefaultMenu()
  }

  goToAuthRequest(appInfo: AppInfo): void {
    debug('go to auth request')
    this.location = oneLineTrim`
      https://auth.getmondo.co.uk/
      ?client_id=${appInfo.client_id}
      &redirect_uri=${appInfo.redirect_uri}
      &response_type=${appInfo.response_type}
      &state=${appInfo.state}
    `
    this.setDefaultMenu()
  }

  goToClientInfo(): void {
    debug('go to client info')
    this.location = format({
      pathname: resolve(__dirname, 'app', 'get-client-info.html'),
      protocol: 'file:',
      slashes: true
    })
    this.setDefaultMenu()
  }
}
