import * as keychain from 'keychain'

export interface IKeychain {
  account: string
  service: string
  type?: string
}

export interface IKeychainSet extends IKeychain {
  password: string
}

export const getPassword = (opts: IKeychain): Promise<string> => {
  return new Promise((resolve, reject) => {
    keychain.getPassword(opts, (err: Error | null, pass: string) => {
      if (err) reject(err)
      resolve(pass)
    })
  })
}

export const setPassword = (opts: IKeychainSet) => {
  return new Promise((resolve, reject) => {
    keychain.setPassword(opts, (err: Error | null) => {
      if (err) reject(err)
      resolve()
    })
  })
}

export const deletePassword = (opts: IKeychain) => {
  return new Promise((resolve, reject) => {
    keychain.deletePassword(opts, (err: Error | null) => {
      if (err) reject(err)
      resolve()
    })
  })
}
