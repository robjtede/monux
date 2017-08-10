import { handleActions, ReducerMap } from 'redux-actions'

import {
  setTransactions,
  addTransactions,
  updateTransactions,
  // hideTransaction,
  // unhideTransaction,
  ISetTransactionsPayload,
  IAddTransactionsPayload,
  IUpdateTransactionsPayload,
  IHideTransactionPayload,
  IUnhideTransactionPayload
} from '../actions'
import { ITransactionsState } from '../store'

export type IModifyTransactionsPayloads =
  | ISetTransactionsPayload
  | IAddTransactionsPayload
  | IUpdateTransactionsPayload

export type IVisibilityTransactionsPayloads =
  | IHideTransactionPayload
  | IUnhideTransactionPayload

export type ITransactionsPayloads =
  | IModifyTransactionsPayloads
  | IVisibilityTransactionsPayloads

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

// const hideReducer: ReducerMap<
//   ITransactionsState,
//   IVisibilityTransactionsPayloads
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

export default handleActions<ITransactionsState, ITransactionsPayloads>(
  {
    ...modifyReducer
    // ...hideReducer
  },
  initialState
)
