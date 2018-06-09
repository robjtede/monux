import Debug = require('debug')

import { Injectable } from '@angular/core'
import { NgRedux } from '@angular-redux/store'
import { createAction } from 'redux-actions'

import { MonzoOldService } from '../services/monzo.old.service'
import { CacheOldService } from '../services/cache.old.service'
import { SpentActions } from './spent'
import { AccountActions } from './account'

import { AppState } from '../state'

import {
  Account,
  accountsRequest,
  MonzoAccountsResponse
} from '../../lib/monzo/Account'
import {
  Amount,
  AmountOpts,
  MonzoBalanceResponse
} from '../../lib/monzo/Amount'
import { extractBalanceAndSpent } from '../../lib/monzo/helpers'

const debug = Debug('app:actions:balance')

@Injectable()
export class BalanceActions {
  static readonly SET_BALANCE = 'SET_BALANCE'
  static readonly GET_BALANCE = 'GET_BALANCE'
  static readonly LOAD_BALANCE = 'LOAD_BALANCE'
  static readonly SAVE_BALANCE = 'SAVE_BALANCE'

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly monzo: MonzoOldService,
    private readonly cache: CacheOldService,
    private readonly spentActions: SpentActions,
    private readonly accountActions: AccountActions
  ) {}

  setBalance(balance: AmountOpts) {
    return createAction<SetBalancePayload, AmountOpts>(
      BalanceActions.SET_BALANCE,
      balance => ({
        amount: balance
      })
    )(balance)
  }

  getBalance() {
    return createAction<GetBalancePromise>(BalanceActions.GET_BALANCE, () => ({
      promise: (async () => {
        try {
          const profile = await this.monzo.request<MonzoAccountsResponse>(
            accountsRequest()
          )
          const acc = new Account(profile.accounts[0])

          debug('profile =>', profile)
          debug('acc =>', acc)

          const bal = await this.monzo.request<MonzoBalanceResponse>(
            acc.balanceRequest()
          )

          debug('HTTP response =>', bal)

          const { balance, spent } = extractBalanceAndSpent(bal)

          debug('HTTP balance =>', balance)

          this.redux.dispatch(this.accountActions.setAccount('monzo', acc.json))
          this.redux.dispatch(this.setBalance(balance.json))
          this.redux.dispatch(this.spentActions.setSpent(spent.json))
          this.redux.dispatch(this.saveBalance(acc, balance))
        } catch (err) {
          console.error(err)
        }
      })()
    }))()
  }

  loadBalance() {
    return createAction<LoadBalancePromise>(
      BalanceActions.LOAD_BALANCE,
      () => ({
        promise: (async () => {
          const { account, balance } = await this.cache.loadBalance()

          debug('cached balance =>', balance)

          this.redux.dispatch(this.accountActions.setAccount('monzo', account))
          this.redux.dispatch(this.setBalance(balance))
        })()
      })
    )()
  }

  saveBalance(acc: Account, balance: Amount) {
    return createAction<SaveBalancePromise, Account, Amount>(
      BalanceActions.SAVE_BALANCE,
      (acc, balance) => ({
        promise: (async () => {
          this.cache.saveAccount(acc, balance)
        })()
      })
    )(acc, balance)
  }
}

export interface GetBalancePromise {
  promise: Promise<void>
}

export interface LoadBalancePromise {
  promise: Promise<void>
}

export interface SaveBalancePromise {
  promise: Promise<void>
}

export interface SetBalancePayload {
  amount: AmountOpts
}
