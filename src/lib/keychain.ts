import keychain = require('keytar')
import Debug = require('debug')

const debug = Debug('app:keychain')

export interface KeychainOpts {
  account: string
  service: string
}

export interface KeychainSetOpts extends KeychainOpts {
  password: string
}

export const getPassword = async (opts: KeychainOpts): Promise<string> => {
  debug('get password =>', opts.account, ':', opts.service)

  const password = await keychain.getPassword(opts.service, opts.account)

  if (password) {
    return password
  } else {
    throw new Error(`Password ${opts.account} : ${opts.service} does not exist`)
  }
}

export const setPassword = async (opts: KeychainSetOpts): Promise<void> => {
  debug('set password =>', opts.account, ':', opts.service)
  return keychain.setPassword(opts.service, opts.account, opts.password)
}

export const deletePassword = async (opts: KeychainOpts): Promise<boolean> => {
  debug('delete password =>', opts.account, ':', opts.service)
  return keychain.deletePassword(opts.service, opts.account)
}
