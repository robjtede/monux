import { handleActions, ReducerMap } from 'redux-actions'

import {
  setTransactions,
  addTransactions,
  updateTransactions,
  hideTransaction,
  IModifyTransactionsPayloads,
  IHideTransactionPayload
} from '../actions'
import { ITransactionsState } from '../store'

const initialState: ITransactionsState = []

const modifyReducer: ReducerMap<
  ITransactionsState,
  IModifyTransactionsPayloads
> = {
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
}

const hideReducer: ReducerMap<ITransactionsState, IHideTransactionPayload> = {
  [hideTransaction.toString()]: (state, { payload }) => {
    if (!payload) throw new TypeError('A payload is required')

    const tx = state.find(tx => tx.id === payload.txId)

    if (tx) {
      const filteredTxs = state.filter(tx => tx.id !== payload.txId)

      const updatedTx = {
        ...tx,
        metadata: {
          ...tx.metadata,
          monux_hidden: 'true'
        }
      }
      return [...filteredTxs, updatedTx]
    } else {
      return state
    }
  }
}

export default handleActions<
  ITransactionsState,
  IModifyTransactionsPayloads | IHideTransactionPayload
>(
  {
    ...modifyReducer,
    ...hideReducer
  },
  initialState
)
