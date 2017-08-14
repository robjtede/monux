import { format, startOfDay, isSameDay, isSameYear, subDays } from 'date-fns'
import { groupBy, map } from 'lodash'

import Transaction from './Transaction'

export const enum GroupingStrategy {
  Day = 'day',
  Merchant = 'merchant',
  None = 'none'
}

export const groupTransactions = (
  txs: Transaction[],
  method = GroupingStrategy.None
): TransactionGroup[] => {
  const groupKey: GroupKeyFunctions = {
    [GroupingStrategy.Day]: tx => {
      const created = new Date(tx.created)
      return (+startOfDay(created)).toString()
    },

    [GroupingStrategy.Merchant]: tx => {
      if (typeof tx.merchant === 'string') {
        return tx.merchant
      } else {
        return tx.merchant
          ? tx.merchant.groupId
          : tx.counterparty.user_id ? 'monzo-contacts' : 'top-ups'
      }
    },

    [GroupingStrategy.None]: () => {
      return 'unsorted'
    }
  }

  return map(groupBy(txs, groupKey[method]), (txs, id) => ({ id, method, txs }))
}

// TODO: sortTransactions

export const getGroupTitle = (group: TransactionGroup): string => {
  const titleFns: GroupTitleFunctions = {
    [GroupingStrategy.Day]: group => {
      const created = new Date(+group.id)

      if (isSameDay(new Date(), created)) {
        return 'Today'
      } else if (isSameDay(created, subDays(new Date(), 1))) {
        return 'Yesterday'
      } else if (isSameYear(created, new Date())) {
        return format(created, 'dddd, Do MMMM')
      } else {
        return format(created, 'dddd, Do MMMM YYYY')
      }
    },

    [GroupingStrategy.Merchant]: group => {
      const tx = group.txs[0]

      if (typeof tx.merchant === 'string') {
        return tx.merchant
      } else {
        return tx.merchant
          ? tx.merchant.name
          : tx.counterparty.user_id ? 'Monzo Contacts' : 'Top Ups'
      }
    },

    [GroupingStrategy.None]: () => {
      return 'Unsorted'
    }
  }

  return titleFns[group.method](group)
}

interface GroupKeyFunctions {
  [method: string]: (tx: Transaction) => string
}

export interface TransactionGroup {
  id: string
  method: GroupingStrategy
  txs: Transaction[]
}

interface GroupTitleFunctions {
  [method: string]: (group: TransactionGroup) => string
}
