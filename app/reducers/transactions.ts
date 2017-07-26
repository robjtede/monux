import { handleActions } from 'redux-actions'

import {
  setTransactions,
  addTransactions,
  updateTransactions,
  IModifyTransactionsPayloads
} from '../actions'
import { ITransactionsState } from '../store'

const initialState: ITransactionsState = []

export const reducer = handleActions<
  ITransactionsState,
  IModifyTransactionsPayloads
>(
  {
    [setTransactions.toString()]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return payload.txs
    },

    [addTransactions.toString()]: (state, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return [...state, ...payload.txs]
    },

    [updateTransactions.toString()]: (state, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      const txIds = payload.txs.map(tx => tx.id)

      const txFilter = state.filter(tx => {
        return !txIds.includes(tx.id)
      })

      return [...txFilter, ...payload.txs]
    }
  },
  initialState
)

export default reducer
