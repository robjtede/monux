import { handleActions, ReducerMap } from 'redux-actions'

import {
  setTransactions,
  addTransactions,
  updateTransactions,
  // hideTransaction,
  // unhideTransaction,
  SetTransactionsPayload,
  AddTransactionsPayload,
  UpdateTransactionsPayload,
  HideTransactionPayload,
  UnhideTransactionPayload
} from '../actions/transaction'
import { TransactionsState } from '../store'

export type ModifyTransactionsPayloads =
  | SetTransactionsPayload
  | AddTransactionsPayload
  | UpdateTransactionsPayload

export type VisibilityTransactionsPayloads =
  | HideTransactionPayload
  | UnhideTransactionPayload

export type TransactionsPayloads =
  | ModifyTransactionsPayloads
  | VisibilityTransactionsPayloads

const initialState: TransactionsState = []

const modifyReducer: ReducerMap<
  TransactionsState,
  ModifyTransactionsPayloads
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

// const hideReducer: ReducerMap<
//   TransactionsState,
//   VisibilityTransactionsPayloads
// > = {
//   [hideTransaction.toString()]: (state, { payload }) => {
//     if (!payload) throw new TypeError('A payload is required')
//
//     const tx = state.find(tx => tx.id === payload.txId)
//
//     if (tx) {
//       const filteredTxs = state.filter(tx => tx.id !== payload.txId)
//
//       const updatedTx = {
//         ...tx,
//         metadata: {
//           ...tx.metadata,
//           monux_hidden: 'true'
//         }
//       }
//       return [...filteredTxs, updatedTx]
//     } else {
//       return state
//     }
//   },
//
//   [unhideTransaction.toString()]: (state, { payload }) => {
//     if (!payload) throw new TypeError('A payload is required')
//
//     const tx = state.find(tx => tx.id === payload.txId)
//
//     if (tx) {
//       const filteredTxs = state.filter(tx => tx.id !== payload.txId)
//
//       const updatedTx = {
//         ...tx,
//         metadata: {
//           ...tx.metadata,
//           monux_hidden: ''
//         }
//       }
//       return [...filteredTxs, updatedTx]
//     } else {
//       return state
//     }
//   }
// }

export default handleActions<TransactionsState, TransactionsPayloads>(
  {
    ...modifyReducer
    // ...hideReducer
  },
  initialState
)
