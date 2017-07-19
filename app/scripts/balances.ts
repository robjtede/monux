import { Account, Amount, Monzo } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import setTouchBar from './touchbar'
import cache, { ICacheAccount } from './cache'
import { IAmountOptions } from '../../lib/monzo'

import { createStore, Action, Store, Reducer, ReducersMapObject } from 'redux'

interface IState {
  balance: IAmountOptions
  spent?: IAmountOptions
}

enum EActions {
  SET_SPENT = 'SET_SPENT',
  SET_BALANCE = 'SET_BALANCE'
}

interface IAction extends Action {
  type: EActions
}

interface ISetSpentAction extends IAction {
  type: EActions.SET_SPENT
  amount: IAmountOptions
}

interface ISetBalanceAction extends IAction {
  type: EActions.SET_BALANCE
  amount: IAmountOptions
}

const initialState: IState = {
  balance: {
    native: {
      amount: 0,
      currency: 'GBP'
    },
    local: undefined
  }
}

const reducer: Reducer<IState> = (state = initialState, action) => {
  const types = {
    [EActions.SET_SPENT]: (state: IState, action: ISetSpentAction) => {
      return {
        ...state,
        spent: action.amount
      }
    },
    [EActions.SET_BALANCE]: (state: IState, action: ISetBalanceAction) => {
      return {
        ...state,
        balance: action.amount
      }
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}

const store: Store<IState> = createStore(reducer)

const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()

export const getCachedAccount = (() => {
  const cachedAccount = cache.accounts.limit(1).toArray()

  return async (): Promise<ICacheAccount> => {
    return (await cachedAccount)[0]
  }
})()

export const getCachedBalance = (() => {
  const cachedBank = getCachedAccount()

  return async (): Promise<Amount> => {
    const { native, local } = JSON.parse((await cachedBank).balance)

    return new Amount(native, local)
  }
})()

export const updateAccountCache = async (acc: Account, balance: Amount) => {
  return cache.accounts.put({
    id: acc.id,
    balance: balance.stringify,
    name: acc.name,
    type: 'Monzo'
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  const $header = document.querySelector('header') as HTMLElement
  const $nav = document.querySelector('nav') as HTMLElement
  const $balance = $header.querySelector(
    '.card-balance h2'
  ) as HTMLHeadingElement
  const $spentToday = $header.querySelector(
    '.spent-today h2'
  ) as HTMLHeadingElement
  const $accDescription = $nav.querySelector('.person') as HTMLDivElement

  store.subscribe(() => {
    const state = store.getState()

    const balance = new Amount(state.balance.native, state.balance.local)
    const spentToday = state.spent
      ? new Amount(state.spent.native, state.spent.local)
      : undefined

    if ((balance && !balance.foreign) || (spentToday && !spentToday.foreign)) {
      if (balance) $balance.innerHTML = balance.html(true, 0)
      if (spentToday) $spentToday.innerHTML = spentToday.html(true, 0)
    } else {
      if (balance) {
        $balance.innerHTML =
          (balance.exchanged as Amount).html(true, 0) + balance.html(true, 0)
      }
      if (spentToday) {
        $spentToday.innerHTML =
          (spentToday.exchanged as Amount).html(true, 0) +
          spentToday.html(true, 0)
      }
    }

    setTouchBar(balance, spentToday)
  })

  const updateAccountInfo = (account: ICacheAccount | Account) => {
    $accDescription.textContent = account.name
  }

  const renderCachedBalance = async () => {
    console.time('render cached balance')
    try {
      const cachedBank = await getCachedAccount()
      updateAccountInfo(cachedBank)

      const cachedBalance = await getCachedBalance()
      store.dispatch(
        {
          type: EActions.SET_BALANCE,
          amount: cachedBalance.json
        } as ISetBalanceAction
      )
    } catch (err) {
      console.error(err)
    }
    console.timeEnd('render cached balance')
  }

  const renderHTTPBalance = async () => {
    console.time('render HTTP balance')
    try {
      const acc = (await (await getMonzo()).accounts)[0]
      const { balance, spentToday } = await acc.balance

      updateAccountCache(acc, balance)
      updateAccountInfo(acc)

      store.dispatch(
        {
          type: EActions.SET_BALANCE,
          amount: balance.json
        } as ISetBalanceAction
      )

      store.dispatch(
        {
          type: EActions.SET_SPENT,
          amount: spentToday.json
        } as ISetSpentAction
      )
    } catch (err) {
      console.error(err)
    }
    console.timeEnd('render HTTP balance')
  }

  renderCachedBalance()
  renderHTTPBalance()
})
