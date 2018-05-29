import { sortBy } from 'lodash'
import { handleActions, ReducerMap } from 'redux-actions'

import {
  TransactionActions,
  // hideTransaction,
  // unhideTransaction,
  SetTransactionsPayload,
  AddTransactionsPayload,
  UpdateTransactionsPayload,
  UnhideTransactionPayload
} from '../actions/transaction'
import { TransactionsState } from '../store'

export type ModifyTransactionsPayloads =
  | SetTransactionsPayload
  | AddTransactionsPayload
  | UpdateTransactionsPayload

export type VisibilityTransactionsPayloads = UnhideTransactionPayload

export type TransactionsPayloads =
  | ModifyTransactionsPayloads
  | VisibilityTransactionsPayloads

const initialState: TransactionsState = []

const modifyReducer: ReducerMap<
  TransactionsState,
  ModifyTransactionsPayloads
> = {
  [TransactionActions.SET_TRANSACTIONS]: (_, { payload }) => {
    if (!payload) throw new TypeError('A payload is required')

    return sortBy(payload.txs, tx => -new Date(tx.created).getTime())
  },

  [TransactionActions.ADD_TRANSACTIONS]: (state, { payload }) => {
    if (!payload) throw new TypeError('A payload is required')

    return sortBy(
      [...state, ...payload.txs],
      tx => -new Date(tx.created).getTime()
    )
  },

  [TransactionActions.UPDATE_TRANSACTIONS]: (state, { payload }) => {
    if (!payload) throw new TypeError('A payload is required')

    const txIds = payload.txs.map(tx => tx.id)

    const txFilter = state.filter(tx => {
      return !txIds.includes(tx.id)
    })

    return sortBy(
      [...txFilter, ...payload.txs],
      tx => -new Date(tx.created).getTime()
    )
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

// TODO: any => TransactionsPayloads
export const reducer = handleActions<TransactionsState, any>(
  {
    ...modifyReducer
    // ...hideReducer
  },
  initialState
)
