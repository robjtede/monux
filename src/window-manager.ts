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
  private _mainWindow: BrowserWindow | undefined
  private _authWindow: BrowserWindow | undefined

  focusMainWindow() {
    if (this._mainWindow) {
      debug('focus main window')
      this._mainWindow.focus()
    }
  }

  hasMainWindow(): boolean {
    return !!this._mainWindow
  }

  hasAuthWindow(): boolean {
    return !!this._authWindow
  }

  get mainWindow(): BrowserWindow {
    if (this._mainWindow) {
      debug('get main window')
      return this._mainWindow
    }

    debug('creating main window')

    const mainWindowState = windowState({
      defaultHeight: 800,
      defaultWidth: 1000
    })

    this._mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      minWidth: 600,
      minHeight: 600,
      titleBarStyle: 'hiddenInset'
    })

    mainWindowState.manage(this._mainWindow)

    this._mainWindow.on('closed', () => {
      this._mainWindow = undefined
    })

    return this._mainWindow
  }

  // get authWindow (): BrowserWindow | undefined {
  //   return this.authWindow
  // }

  set mainLocation(url: string) {
    debug('set window location =>', url)
    this.mainWindow.loadURL(url)
  }

  set menu(menu: Electron.MenuItemConstructorOptions[]) {
    debug('set menu')
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  }

  setDefaultMenu(): void {
    debug('set default menu')
    this.menu = makeMacOSMenu(this)
  }

  goToMonux(): void {
    debug('go to monux')
    this.mainLocation = format({
      pathname: resolve(__dirname, 'app', 'index.html'),
      protocol: 'file:'
    })
    this.setDefaultMenu()
  }

  openAuthRequest(url: string): void {
    this.closeAuthRequest()

    debug('open auth request', url)

    this._authWindow = new BrowserWindow({
      width: 600,
      height: 800
    })

    this._authWindow.loadURL(url)
    this._authWindow.focus()

    this._authWindow.on('closed', () => {
      this._authWindow = undefined
    })
  }

  closeAuthRequest(): void {
    debug('close auth window')
    if (this.hasAuthWindow()) (this._authWindow as BrowserWindow).close()
  }
}
