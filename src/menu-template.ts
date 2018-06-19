import { shell, MenuItemConstructorOptions } from 'electron'

import { saveCode } from './lib/monzo/auth'
import { WindowManager } from './window-manager'

export const makeMacOSMenu = (
  windowManager: WindowManager
): MenuItemConstructorOptions[] => [
  {
    label: 'Application',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { role: 'resetzoom' }
    ]
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Monux GitHub Repo',
        click: () => shell.openExternal('https://github.com/robjtede/monux')
      },
      {
        label: 'Learn More About Electron',
        click: () => shell.openExternal('http://electron.atom.io')
      }
    ]
  }
]
