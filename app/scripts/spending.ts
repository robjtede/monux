import * as Debug from 'debug'
import { isSameMonth, subMonths } from 'date-fns'
import * as d3 from 'd3'

import cache, { ICacheTransaction } from './cache'
import { Amount, Transaction } from '../../lib/monzo'

const debug = Debug('app:renderer:spending')

export const getCachedTransactions = (() => {
  const cachedTxs = cache.transactions.toArray()

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

const titleCase = (str: string) => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const groupTotal = (group: Transaction[]) => {
  return group
    .filter(tx => {
      if (tx.is.metaAction || tx.declined) return false
      return true
    })
    .reduce((sum, tx) => {
      return tx.amount.positive ? sum : sum + Number(tx.amount)
    }, 0)
}

const groupSort = (a: [string, Transaction[]], b: [string, Transaction[]]) => {
  const atot = groupTotal(a[1])
  const btot = groupTotal(b[1])

  return atot - btot
}

const groups = async (months: number) => {
  await getCachedTransactions()

  const cachedTxs = await cache.transactions.toArray()
  const txs = cachedTxs.map((tx: ICacheTransaction, index: number) => {
    return new Transaction(undefined, undefined, JSON.parse(tx.json), index)
  })

  const currentMonth = txs.filter(tx => {
    return isSameMonth(tx.created, subMonths(new Date(), months))
  })

  const groups = currentMonth.reduce((groups, tx) => {
    // const groups = txs.reduce((groups, tx) => {
    const groupId = tx.category.raw

    if (groupId in groups) groups[groupId].push(tx)
    else groups[groupId] = [tx]

    return groups
  }, {} as { [groupId: string]: Transaction[] })

  return Object.entries(groups)
    .sort(groupSort)
    .map(([_, txs]) => txs)
    .map(group => {
      return {
        name: titleCase(group[0].category.formatted),
        spent: new Amount({ amount: groupTotal(group), currency: 'GBP' })
      }
    })
}

const drawGroupStats = async groups => {
  const sum = d3.sum(groups, d => Math.abs(d.spent.raw))

  const WIDTH = 500
  const HEIGHT = 500
  const THICKNESS = 80
  const OUTER_RADIUS = 200
  const INNER_RADIUS = OUTER_RADIUS - THICKNESS
  const MIN_PER = 0.012

  const svg = d3
    .select('.spending-vis svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)

  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const arc = d3.arc().outerRadius(OUTER_RADIUS).innerRadius(INNER_RADIUS)
  const pie = d3
    .pie()
    .value(d => {
      const val = Math.abs(d.spent.raw)

      return val / sum > MIN_PER ? val : sum * MIN_PER
    })
    .sort(null)

  const group = svg
    .select('g')
    .attr('transform', `translate(${WIDTH / 2},${HEIGHT / 2})`)

  const label = group
    .select('text')
    .attr('transform', 'translate(0, 250)')
    .attr('text-anchor', 'middle')

  const gdata = group.selectAll('.arc').data(pie(groups))

  const segment = gdata
    .enter()
    .append('path')
    .merge(gdata)
    .attr('d', d => arc(d))
    .attr('fill', (_, i) => color(i))
    .classed('arc', true)

  gdata.exit().remove()

  segment.on('mouseover', d => {
    label.html(d.data.name + ': ' + d.data.spent.format('%y%j%p%n'))
  })

  segment.on('mouseout', d => {
    label.html('')
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  const els = Array.from(document.querySelectorAll('.spending-month'))

  console.log(els)

  els.forEach((el: HTMLElement) => {
    el.addEventListener('click', async () => {
      console.log('click', el)
      await drawGroupStats(await groups(Number(el.dataset.monthdiff)))
    })
  })
})
