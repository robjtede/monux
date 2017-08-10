import * as Debug from 'debug'
import { createAction } from 'redux-actions'

// import {
//   getCachedAccount,
//   getCachedBalance,
//   updateAccountCache
// } from '../scripts/cache'

import { EActions } from './index'
// import { store } from '../store'
// import { setAccount, setSpent } from './'

import { AmountOpts } from '../../lib/monzo/Amount'

const debug = Debug('app:redux:actions:balance')

export interface IGetBalancePromise {
  promise: Promise<void>
}

export interface ILoadBalancePromise {
  promise: Promise<void>
}

export interface ISetBalancePayload {
  amount: AmountOpts
}

export const setBalance = createAction<
  ISetBalancePayload,
  AmountOpts
>(EActions.SET_BALANCE, balance => ({
  amount: balance
}))

// export const loadBalance = createAction<
//   ILoadBalancePromise
// >(EActions.LOAD_BALANCE, () => ({
//   promise: (async () => {
//     try {
//       const cachedAccount = await getCachedAccount()
//       const cachedBalance = await getCachedBalance()
//
//       debug('cached balance =>', cachedBalance)
//
//       store.dispatch(setAccount('monzo', cachedAccount.acc))
//       store.dispatch(setBalance(cachedBalance.json))
//     } catch (err) {
//       console.error(err)
//     }
//   })()
// }))

// export const getBalance = createAction<
//   IGetBalancePromise
// >(EActions.GET_BALANCE, () => ({
//   promise: (async () => {
//     try {
//       const acc = (await (await getMonzo()).accounts)[0]
//       const { balance, spentToday } = await acc.balance
//
//       debug('HTTP balance =>', balance)
//
//       store.dispatch(setAccount('monzo', acc.json))
//       store.dispatch(setBalance(balance.json))
//       store.dispatch(setSpent(spentToday.json))
//       store.dispatch({
//         type: 'SAVE_ACCOUNT_BALANCE',
//         payload: updateAccountCache(acc, balance)
//       })
//     } catch (err) {
//       console.error(err)
//     }
//   })()
// }))
