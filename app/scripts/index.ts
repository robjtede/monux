import devtron = require('devtron')
import context = require('electron-contextmenu-middleware')
import imageMenu = require('electron-image-menu')

devtron.install()

context.use(imageMenu)
context.activate()
