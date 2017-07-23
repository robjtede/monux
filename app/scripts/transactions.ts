import * as Debug from 'debug'
import { forEach } from 'p-iteration'

import { Account, Monzo, Transaction } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import db, { ICacheTransaction, ICacheAccount } from './cache'

const debug = Debug('app:renderer:index')

const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()

export const getCachedAccount = (() => {
  const cachedAccount = db.accounts.limit(1).toArray()

  return async (): Promise<ICacheAccount> => {
    return (await cachedAccount)[0]
  }
})()

export const getCachedTransactions = (() => {
  const cachedTxs = db.transactions.toArray()

  return async (): Promise<Transaction[]> => {
    try {
      return (await cachedTxs).map((tx: ICacheTransaction, index: number) => {
        return new Transaction(undefined, undefined, JSON.parse(tx.json), index)
      })
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
})()

const updateTransactionCache = async (acc: Account, tx: Transaction) => {
  try {
    await db.transactions.put({
      id: tx.id,
      created_at: tx.created,
      accId: acc.id,
      json: tx.json
    })
  } catch (err) {
    console.error(err)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const $app = document.querySelector('main') as HTMLElement
  const $txList = $app.querySelector('m-transaction-list') as HTMLElement
  const $txDetail = $app.querySelector('m-transaction-detail') as HTMLElement

  const renderTransactions = (txs: Transaction[], append: boolean = false) => {
    $txList.txs = append ? $txList.txs.concat(txs) : txs
    $txList.classList.remove('inactive')
    $txList.render()
  }

  const renderCachedTransactions = async () => {
    console.time('render cached transaction list')
    const txs = await getCachedTransactions()
    debug('cached transactions =>', txs)

    renderTransactions(txs)
    console.timeEnd('render cached transaction list')
  }

  const renderHTTPTransactions = async () => {
    console.time('render HTTP transaction list')
    try {
      const account = (await (await getMonzo()).accounts)[0]

      // TODO: Table#orderBy
      const cachedTxs = await db.transactions.reverse().sortBy('created_at')
      const anyCached = cachedTxs.length > 0

      const txs = anyCached
        ? await account.transactions({ since: cachedTxs[0].id })
        : await account.transactions()

      debug('HTTP transactions =>', txs)

      // apply new online objects to existing txs
      $txList.txs.forEach(($tx: Transaction) => {
        $tx.monzo = account.monzo
        $tx.acc = account
      })

      renderTransactions(txs, true)

      $txDetail.removeAttribute('offline')

      const $selectedTx = $txList.selectedTransaction

      if ($selectedTx) {
        const $tx = $txList.getTransactionByIndex($selectedTx.index)
        $tx.classList.add('selected')
        $tx.render()

        $txDetail.$summary = $tx
        $txDetail.tx = $tx.tx
        $txDetail.dataset.category = $tx.tx.category
        $txDetail.render()
      }
      console.timeEnd('render HTTP transaction list')

      // TODO: bulkPut
      await forEach(txs, async (tx: Transaction) => {
        updateTransactionCache(account, tx)
      })
    } catch (err) {
      console.error(err)
    }
  }

  const updatePendingTransactions = async () => {
    const toUpdate = $txList.allTransactions
      .filter(($tx: HTMLElement) => {
        return $tx.tx.pending
      })
      .forEach($tx => {
        $tx.tx.acc
          .transaction($tx.tx.id)
          .then(tx => {
            $tx.tx = tx
            $tx.render()

            $txDetail.tx = $tx.tx
            $txDetail.dataset.category = $tx.tx.category
            $txDetail.dataset.index = $tx.index
            $txDetail.render()

            return db.transactions.put({
              id: tx.id,
              created_at: tx.created,
              accId: tx.acc.id,
              json: tx.json
            })
          })
          .then(cache => {
            $tx.debug(`updated cached ${$tx.tx.id}`)
          })
          .catch(err => {
            console.error(err)
          })
      })
  }

  await Promise.all([renderCachedTransactions(), renderHTTPTransactions()])
  updatePendingTransactions()
})
