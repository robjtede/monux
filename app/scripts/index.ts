import context = require('electron-contextmenu-middleware')
import imageMenu = require('electron-image-menu')

context.use(imageMenu)
context.activate()
