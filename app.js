'use strict'

const path = require('path')
const url = require('url')
const querystring = require('querystring')

const request = require('request-promise')

const electron = require('electron')
const {app, BrowserWindow} = electron

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({width: 1280, height: 800})

  mainWindow.loadURL(url.format({
    pathname: path.resolve('index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (!mainWindow) createWindow()
})
