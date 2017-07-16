import { randomBytes } from 'crypto'
import { parse as parseQueryString } from 'querystring'
import { parse as parseUrl } from 'url'
import * as Debug from 'debug'

import { app } from 'electron'
import { enableLiveReload } from 'electron-compile'

import {
  getAccessToken,
  refreshAccess,
  verifyAccess,
  getSavedCode,
  saveCode
} from '../lib/monzo/auth'
import WindowManager from './window-manager'

const debug = Debug('app:app')
const mainWindow = new WindowManager()

enableLiveReload()

if(!app.isDefaultProtocolClient(app.getName())
{
    app.setAsDefaultProtocolClient(app.getName())
}

debug(`starting`, app.getName(), 'version', app.getVersion())

export interface IAppInfo {
  client_id: string
  client_secret: string
  redirect_uri: string
  response_type: string
  state: string
}

const getAppInfo = (() => {
  const state = new Promise<string>((resolve, reject) => {
    randomBytes(512, (err, buf) => {
      if (err) reject(err)
      resolve(buf.toString('hex'))
    })
  })

  return async (): Promise<IAppInfo> => {
    return {
      client_id: await getSavedCode('client_id'),
      client_secret: await getSavedCode('client_secret'),
      redirect_uri: 'monux://auth/',
      response_type: 'code',
      state: await state
    }
  }
})()

async function parseAuthUrl(forwardedUrl) {
  const appInfo = await getAppInfo()
  const query = parseUrl(forwardedUrl).query
  const authResponse = parseQueryString(query)

  if (authResponse.state !== appInfo.state) {
	console.error('Auth state mismatch')
	console.error(authResponse.state)
	console.error(appInfo.state)
	throw new Error('Auth state mismatch')
  }

  const authCode = authResponse.code
  debug('authcode =>', authCode)

  try {
	const { accessToken, refreshToken } = await getAccessToken(
	  appInfo,
	  authCode
	)

	debug('token =>', accessToken)
	if (await verifyAccess(accessToken)) {
	  await saveCode('access_token', accessToken)
	  await saveCode('refresh_token', refreshToken)

	  mainWindow.goToMonux()
	} else {
	  console.error('Invalid access token')
	  throw new Error('Invalid access token')
	}
  } catch (err) {
	console.error(err)
	throw new Error(err)
  }
}

const isSecondInstance = app.makeSingleInstance(async (commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) myWindow.restore()
    mainWindow.focus()
    if( process.platform === 'win32' && process.argv.length > 1) {
	  console.warn('getting command line arguments')
	  console.warn(process.argv)
	  var urlParams = process.argv.filter(function(param){
	    return param.startsWith('monux://')
	  })
	  
	  if(urlParams.length > 1) {
	    console.err('Invalid number of auth urls')
	    throw new Error('Invalid number of auth urls')
	  }
	  
	  if(urlParams.length == 1) {
		console.warn('auth url found')
		console.warn(urlParams[0])
        await parseAuthUrl(urlParams[0])
	  }
	}
  }
})

if (isSecondInstance) {
  app.quit()
}

app.on('ready', async () => {
  debug('ready event')

  try {
    const appInfo = await getAppInfo()
	
    try {
      const accessToken = await getSavedCode('access_token')

      try {
        const access = await verifyAccess(accessToken)

        if (access) {
          mainWindow.goToMonux()
        } else {
          const refreshToken = await getSavedCode('refresh_token')

          const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          } = await refreshAccess(appInfo, refreshToken)

          if (await verifyAccess(newAccessToken)) {
            await saveCode('access_token', newAccessToken)
            await saveCode('refresh_token', newRefreshToken)

            mainWindow.goToMonux()
          } else {
            console.error('Invalid refresh token')
            throw new Error('Invalid refresh token')
          }
        }
      } catch (err) {
        console.warn(err.name)
        if (err.name === 'RequestError') mainWindow.goToMonux()
        else throw new Error(err)
      }
    } catch (err) {
      mainWindow.goToAuthRequest(appInfo)
    }
  } catch (err) {
    mainWindow.goToClientInfo()
  }
})

app.on('open-url', async (_, forwardedUrl) => {
  debug('open-url event')

  await parseAuthUrl(forwardedUrl)
})

app.on('window-all-closed', () => {
  debug('window-all-closed event')

  // conflicts with auth strategy for now
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  debug('activate event')
  if (mainWindow.hasWindow) mainWindow.focus()
  else mainWindow.goToMonux()
})
