import { MonzoAccountsResponse, MonzoBalanceResponse } from 'monzolib'

export const accounts: MonzoAccountsResponse = {
  accounts: [
    {
      id: 'acc_00009OBC6jkX5HkkIP6SjB',
      closed: false,
      created: '2017-09-04T17:00:25.729Z',
      description: 'Robert James Taylor Ede',
      account_number: '75917712',
      sort_code: '040004',
      type: 'uk_retail',
      owners: [
        {
          user_id: 'user_00009CpvBVFq7GRDxwI0Ab',
          preferred_name: 'Rob Ede',
          preferred_first_name: 'Rob'
        }
      ]
    }
  ]
}

export const balance: MonzoBalanceResponse = {
  balance: 11339,
  total_balance: 15948,
  currency: 'GBP',
  spend_today: -1786,
  local_currency: 'ISK',
  local_exchange_rate: 139.676771,
  local_spend: [
    { spend_today: -1298, currency: 'GBP' },
    { spend_today: -690, currency: 'ISK' },
    { spend_today: -1090, currency: 'USD' }
  ]
}

// TODO: should conform to MonzoTransactionsResponse
export const transactions = {
  transactions: [
    {
      id: 'tx_00009W9l5IIf8Moe7BskwT',
      created: '2018-05-01T07:19:43.633Z',
      description: 'ITUNES.COM/BILL        ITUNES.COM    IRL',
      amount: -499,
      fees: {},
      currency: 'GBP',
      merchant: {
        id: 'merch_00009OJa9UvGcQGfGPzVdh',
        group_id: 'grp_000092cOo7qUnWA829G9Oz',
        created: '2017-09-08T18:07:32.353Z',
        name: 'iTunes',
        logo:
          'https://mondo-logo-cache.appspot.com/twitter/@iTunes/?size=large',
        emoji: '🎵',
        category: 'entertainment',
        online: true,
        atm: false,
        address: {
          short_formatted: 'Somewhere in Ireland',
          formatted: 'Ireland',
          address: '',
          city: '',
          region: '',
          country: 'IRL',
          postcode: '',
          latitude: 53,
          longitude: -8,
          zoom_level: 5,
          approximate: true
        },
        updated: '2018-06-24T13:56:02.985Z',
        metadata: {
          created_for_merchant: 'merch_000092cOo7ney4IkL4l8HR',
          created_for_transaction: 'tx_00009OJa9TNuKyBQZf2OAL',
          enriched_from_settlement: 'tx_00009Ol8jLDUpFEHIOhNdB',
          foursquare_id: '',
          foursquare_website: '',
          google_places_icon: '',
          google_places_id: '',
          google_places_name: '',
          provider: 'user',
          provider_id: '',
          suggested_tags: '#music #fun',
          twitter_id: '@iTunes',
          website: 'itunes.com'
        },
        disable_feedback: false
      },
      notes: 'Apple Music\n\nOrder No: MVFJ2YV0V2',
      metadata: {
        ledger_insertion_id: 'entryset_00009W9l5GVLoD93XRplnl',
        mastercard_auth_message_id: 'mcauthmsg_00009W9l5FdT2YfvqqapSD',
        mastercard_lifecycle_id: 'mclifecycle_00009W9l5G6tHAD9K6MKJd',
        notes: 'Apple Music\n\nOrder No: MVFJ2YV0V2'
      },
      labels: null,
      account_balance: 0,
      attachments: [],
      international: null,
      category: 'entertainment',
      is_load: false,
      settled: '2018-05-02T05:57:47.103Z',
      local_amount: -499,
      local_currency: 'GBP',
      updated: '2018-05-02T05:57:47.157Z',
      account_id: 'acc_00009OBC6jkX5HkkIP6SjB',
      user_id: '',
      counterparty: {},
      scheme: 'mastercard',
      dedupe_id:
        'mclifecycle:mclifecycle_00009W9l5G6tHAD9K6MKJd:MASTERCARD_AUTH:mcauthmsg_00009W9l5FdT2YfvqqapSD',
      originator: false,
      include_in_spending: true,
      can_be_excluded_from_breakdown: true,
      can_be_made_subscription: false
    },
    {
      id: 'tx_00009W9l5MWzP21MEGeABl',
      created: '2018-05-01T07:19:44.592Z',
      description: 'pot_00009VcqOvOY5lIl0ZTuTJ',
      amount: -1,
      fees: {},
      currency: 'GBP',
      merchant: null,
      notes: '',
      metadata: {
        external_id:
          'CoinJarRule:tx_00009W9l5IIf8Moe7BskwT:pot_00009VcqOvOY5lIl0ZTuTJ',
        ledger_insertion_id: 'entryset_00009W9l5La8vowvHl7ASv',
        pot_id: 'pot_00009VcqOvOY5lIl0ZTuTJ',
        trigger: 'coin_jar'
      },
      labels: null,
      account_balance: 0,
      attachments: [],
      international: null,
      category: 'general',
      is_load: false,
      settled: '2018-05-01T07:19:44.592Z',
      local_amount: -1,
      local_currency: 'GBP',
      updated: '2018-05-01T07:19:44.608Z',
      account_id: 'acc_00009OBC6jkX5HkkIP6SjB',
      user_id: '',
      counterparty: {},
      scheme: 'uk_retail_pot',
      dedupe_id:
        'pot_00009VcqOvOY5lIl0ZTuTJ:acc_00009OBC6jkX5HkkIP6SjB:deposit:CoinJarRule:tx_00009W9l5IIf8Moe7BskwT:pot_00009VcqOvOY5lIl0ZTuTJ',
      originator: true,
      include_in_spending: false,
      can_be_excluded_from_breakdown: false,
      can_be_made_subscription: false
    },
    {
      id: 'tx_00009W9uj3sv324rADDp3J',
      created: '2018-05-01T09:07:45.706Z',
      description: 'DIGITALOCEAN COM       NEW YORK CITY NY ',
      amount: -883,
      fees: {},
      currency: 'GBP',
      merchant: {
        id: 'merch_00009CpyLCnhshZfdMqoAj',
        group_id: 'grp_00009373Xa4EXhAaDq9zRh',
        created: '2016-09-30T10:44:07.333Z',
        name: 'Digital Ocean',
        logo:
          'https://mondo-logo-cache.appspot.com/twitter/DigitalOcean/?size=large',
        emoji: '💻',
        category: 'entertainment',
        online: true,
        atm: false,
        address: {
          short_formatted: 'Somewhere in the USA',
          formatted: 'USA',
          address: '',
          city: '',
          region: '',
          country: 'USA',
          postcode: '',
          latitude: 40.7182131,
          longitude: -74.0009721,
          zoom_level: 2,
          approximate: true
        },
        updated: '2018-06-07T07:05:48.42Z',
        metadata: {
          created_for_merchant: 'merch_00009373Xa3WaK1zjoYDEv',
          created_for_transaction: 'tx_00009CpyLCQfGNJUL1fT1d',
          enriched_from_settlement: 'tx_00009CrbyRCaMWUKoskA8v',
          google_places_icon:
            'https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png',
          google_places_id: 'ChIJj_9sJJ38ZUARUdXQtNVOiLA',
          google_places_name: 'DigitalOcean',
          provider: 'user',
          provider_id: '',
          suggested_tags: '#software #fun #cloud #hosting ',
          twitter_id: 'DigitalOcean',
          website: 'https://www.digitalocean.com/'
        },
        disable_feedback: false
      },
      notes: '',
      metadata: {
        ledger_insertion_id: 'entryset_00009W9uj2vMcRqJ0cwtv7',
        mastercard_auth_message_id: 'mcauthmsg_00009W9uj28RYLJ5jmTByL',
        mastercard_lifecycle_id: 'mclifecycle_00009W9uj2Wu5ObwNJZQMD'
      },
      labels: null,
      account_balance: 0,
      attachments: [],
      international: null,
      category: 'bills',
      is_load: false,
      settled: '2018-05-02T11:22:29.782Z',
      local_amount: -1200,
      local_currency: 'USD',
      updated: '2018-05-02T11:22:30.074Z',
      account_id: 'acc_00009OBC6jkX5HkkIP6SjB',
      user_id: '',
      counterparty: {},
      scheme: 'mastercard',
      dedupe_id:
        'mclifecycle:mclifecycle_00009W9uj2Wu5ObwNJZQMD:MASTERCARD_AUTH:mcauthmsg_00009W9uj28RYLJ5jmTByL',
      originator: false,
      include_in_spending: true,
      can_be_excluded_from_breakdown: true,
      can_be_made_subscription: false
    },
    {
      id: 'tx_00009W9uj5aCjZOypuAVmL',
      created: '2018-05-01T09:07:46.065Z',
      description: 'pot_00009VcqOvOY5lIl0ZTuTJ',
      amount: -33,
      fees: {},
      currency: 'GBP',
      merchant: null,
      notes: '',
      metadata: {
        external_id:
          'CoinJarRule:tx_00009W9uj3sv324rADDp3J:pot_00009VcqOvOY5lIl0ZTuTJ',
        ledger_insertion_id: 'entryset_00009W9uj4hG1sLLgKm1Vx',
        pot_id: 'pot_00009VcqOvOY5lIl0ZTuTJ',
        trigger: 'coin_jar'
      },
      labels: null,
      account_balance: 0,
      attachments: [],
      international: null,
      category: 'general',
      is_load: false,
      settled: '2018-05-01T09:07:46.065Z',
      local_amount: -33,
      local_currency: 'GBP',
      updated: '2018-05-01T09:07:46.104Z',
      account_id: 'acc_00009OBC6jkX5HkkIP6SjB',
      user_id: '',
      counterparty: {},
      scheme: 'uk_retail_pot',
      dedupe_id:
        'pot_00009VcqOvOY5lIl0ZTuTJ:acc_00009OBC6jkX5HkkIP6SjB:deposit:CoinJarRule:tx_00009W9uj3sv324rADDp3J:pot_00009VcqOvOY5lIl0ZTuTJ',
      originator: true,
      include_in_spending: false,
      can_be_excluded_from_breakdown: false,
      can_be_made_subscription: false
    },
    {
      id: 'tx_00009WAMK3iBLsxcvbemsz',
      created: '2018-05-01T14:16:59.015Z',
      description: 'STEAM YARD             SHEFFIELD S1  GBR',
      amount: -280,
      fees: {},
      currency: 'GBP',
      merchant: {
        id: 'merch_000096iu58XbuhO5wwA4NF',
        group_id: 'grp_000096iu58XbuhEJl6btrt',
        created: '2016-03-31T13:40:48.699Z',
        name: 'Steam Yard',
        logo:
          'https://mondo-logo-cache.appspot.com/twitter/steamyard/?size=large',
        emoji: '☕️',
        category: 'eating_out',
        online: false,
        atm: false,
        address: {
          short_formatted: '95-101 Division Street, Sheffield S1 4GE',
          formatted: '95-101 Division Street, Sheffield S1 4GE, United Kingdom',
          address: '95-101 Division Street',
          city: 'Sheffield',
          region: '',
          country: 'GBR',
          postcode: 'S1 4GE',
          latitude: 53.379426,
          longitude: -1.4762385,
          zoom_level: 17,
          approximate: false
        },
        updated: '2016-06-27T10:19:31.546Z',
        metadata: {
          created_for_merchant: 'merch_000096iu58XbuhO5wwA4NF',
          created_for_transaction: 'tx_000096iu58Dl6VVr1ib5mL',
          enriched_from_settlement: 'tx_000098DnqcNIBGvZFswvXl',
          foursquare_category: 'Coffee Shop',
          foursquare_id: '52d68a56498e5b5ece24d2a6',
          foursquare_website: '',
          google_places_icon:
            'https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png',
          google_places_id: 'ChIJAQBseICCeUgREYOnHLLHk8w',
          google_places_name: 'Steam Yard',
          suggested_name: 'Steam Yard Coffee Co',
          suggested_tags: '#food',
          twitter_id: 'steamyard'
        },
        disable_feedback: false
      },
      notes: 'Regular Hot Chocolate',
      metadata: {
        ledger_insertion_id: 'entryset_00009WAMK2ahWDyiczYetF',
        mastercard_auth_message_id: 'mcauthmsg_00009WAMK1UzZxuKuS8oqX',
        mastercard_lifecycle_id: 'mclifecycle_00009WAMK2E0sZZIuIbEmn',
        notes: 'Regular Hot Chocolate'
      },
      labels: null,
      account_balance: 0,
      attachments: [],
      international: null,
      category: 'eating_out',
      is_load: false,
      settled: '2018-05-02T05:30:49.8Z',
      local_amount: -280,
      local_currency: 'GBP',
      updated: '2018-05-08T03:38:06.373Z',
      account_id: 'acc_00009OBC6jkX5HkkIP6SjB',
      user_id: '',
      counterparty: {},
      scheme: 'mastercard',
      dedupe_id:
        'mclifecycle:mclifecycle_00009WAMK2E0sZZIuIbEmn:MASTERCARD_AUTH:mcauthmsg_00009WAMK1UzZxuKuS8oqX',
      originator: false,
      include_in_spending: true,
      can_be_excluded_from_breakdown: true,
      can_be_made_subscription: false
    },
    {
      id: 'tx_00009WAMK5e0AOnyvDiTeD',
      created: '2018-05-01T14:16:59.44Z',
      description: 'pot_00009VcqOvOY5lIl0ZTuTJ',
      amount: -20,
      fees: {},
      currency: 'GBP',
      merchant: null,
      notes: '',
      metadata: {
        external_id:
          'CoinJarRule:tx_00009WAMK3iBLsxcvbemsz:pot_00009VcqOvOY5lIl0ZTuTJ',
        ledger_insertion_id: 'entryset_00009WAMK4w2npdwit9N8D',
        pot_id: 'pot_00009VcqOvOY5lIl0ZTuTJ',
        trigger: 'coin_jar'
      },
      labels: null,
      account_balance: 0,
      attachments: [],
      international: null,
      category: 'general',
      is_load: false,
      settled: '2018-05-01T14:16:59.44Z',
      local_amount: -20,
      local_currency: 'GBP',
      updated: '2018-05-01T14:16:59.451Z',
      account_id: 'acc_00009OBC6jkX5HkkIP6SjB',
      user_id: '',
      counterparty: {},
      scheme: 'uk_retail_pot',
      dedupe_id:
        'pot_00009VcqOvOY5lIl0ZTuTJ:acc_00009OBC6jkX5HkkIP6SjB:deposit:CoinJarRule:tx_00009WAMK3iBLsxcvbemsz:pot_00009VcqOvOY5lIl0ZTuTJ',
      originator: true,
      include_in_spending: false,
      can_be_excluded_from_breakdown: false,
      can_be_made_subscription: false
    },
    {
      id: 'tx_00009WAUfnR3LYW8S6WMmf',
      created: '2018-05-01T15:50:33.104Z',
      description: 'SAINSBURYS SACAT(4253) SHEFFIELD     GBR',
      amount: -135,
      fees: {},
      currency: 'GBP',
      merchant: {
        id: 'merch_000096j6SfeOB9AkkMJvAf',
        group_id: 'grp_000092JYbNZELEWvugCnyr',
        created: '2016-03-31T15:59:31.512Z',
        name: "Sainsbury's",
        logo:
          'https://mondo-logo-cache.appspot.com/twitter/@sainsburys/?size=large',
        emoji: '🍏',
        category: 'groceries',
        online: false,
        atm: false,
        address: {
          short_formatted: '50 Upper Hanover Street, Sheffield S3 7LR',
          formatted:
            '50 Upper Hanover Street, Sheffield S3 7LR, United Kingdom',
          address: '50 Upper Hanover Street',
          city: 'Sheffield',
          region: '',
          country: 'GBR',
          postcode: 'S3 7LR',
          latitude: 53.3804935,
          longitude: -1.4843305,
          zoom_level: 17,
          approximate: false
        },
        updated: '2016-04-20T10:24:01.499Z',
        metadata: {
          created_for_merchant: 'merch_000092JYbNXSRpSYIe325R',
          created_for_transaction: 'tx_000096j6SfMfF2zzvjkdtJ',
          foursquare_category: 'Convenience Store',
          foursquare_category_icon:
            'https://ss3.4sqi.net/img/categories_v2/shops/conveniencestore_88.png',
          foursquare_id: '4b42737af964a52034d425e3',
          foursquare_website: 'http://www.sainsburys.co.uk',
          google_places_icon:
            'https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png',
          google_places_id: 'ChIJfyA6lHiCeUgRO6LmcUZFNtI',
          google_places_name: "Sainsbury's Bank",
          suggested_name: "Sainsbury's Local",
          suggested_tags: '#groceries',
          twitter_id: 'sainsburys',
          website: 'http://www.sainsburys.co.uk/'
        },
        disable_feedback: false
      },
      notes: 'Triple Chocolate Cookies 4 pack',
      metadata: {
        ledger_insertion_id: 'entryset_00009WAUfmKzQbm8d2lycL',
        mastercard_auth_message_id: 'mcauthmsg_00009WAUflKx9GEEeOXM2r',
        mastercard_lifecycle_id: 'mclifecycle_00009WAUflyeletWm4tlgH',
        notes: 'Triple Chocolate Cookies 4 pack'
      },
      labels: null,
      account_balance: 0,
      attachments: [],
      international: null,
      category: 'groceries',
      is_load: false,
      settled: '2018-05-02T03:34:45.895Z',
      local_amount: -135,
      local_currency: 'GBP',
      updated: '2018-05-02T03:34:45.994Z',
      account_id: 'acc_00009OBC6jkX5HkkIP6SjB',
      user_id: '',
      counterparty: {},
      scheme: 'mastercard',
      dedupe_id:
        'mclifecycle:mclifecycle_00009WAUflyeletWm4tlgH:MASTERCARD_AUTH:mcauthmsg_00009WAUflKx9GEEeOXM2r',
      originator: false,
      include_in_spending: true,
      can_be_excluded_from_breakdown: true,
      can_be_made_subscription: false
    }
  ]
}
