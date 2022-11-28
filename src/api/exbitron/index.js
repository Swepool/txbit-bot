// Kryptokrona ©2022
const crypto = require("crypto");
const {fetch} = require('cross-fetch')
const url = require('url')
const FormData = require('form-data');
const {authenticator} = require("otplib");

const URL = 'https://www.exbitron.com/api/v2/peatio'

function API(key, secret) {

    const apiKey = key
    const apiSecret = secret
    const nonce = Date.now()

    const headers = {
        "X-Auth-Apikey": apiKey,
        "X-Auth-Nonce": getNonce(),
        "X-Auth-Signature": sign(apiSecret, (nonce + apiKey))

    }

    this.getBalances = async function () {
        const endpoint = URL + `/account/balances`
        const req = await fetch(endpoint, {
            method: 'GET',
            headers: headers
        })
        return await req.json()
    }


    this.market = {

        /**
         * Get your executed trades. Trades are sorted in reverse creation order.
         * @param {string=} data.market
         * @param {string=} data.market_type
         * @param {number=} data.limit - Limit the number of returned trades. Default to 100.
         * @param {number=} data.page - Specify the page of paginated results.
         * @param {string=} data.type - To indicate nature of trade - buy/sell
         * @param {number=} data.time_from - An integer represents the seconds elapsed since Unix epoch.If set, only trades executed after the time will be returned.
         * @param {number=} data.time_to - An integer represents the seconds elapsed since Unix epoch.If set, only trades executed before the time will be returned.
         * @param {string=} data.order_by - If set, returned trades will be sorted in specific order, default to 'desc'.
         */
        getTradeHistory: async function (data) {
            let endpoint = URL + `/market/trades`
            let params = new url.URLSearchParams()

            if (data?.market) params.append('market', data.market)
            if (data?.market_type) params.append('market_type', data.market_type)
            if (data?.limit) params.append('limit', data.limit)
            if (data?.page) params.append('page', data.page)
            if (data?.type) params.append('type', data.type)
            if (data?.time_from) params.append('time_from', data.time_from)
            if (data?.time_to) params.append('time_to', data.time_to)
            if (data?.order_by) params.append('order_by', data.order_by)

            const req = await fetch(`${endpoint}?${params.toString()}`,
                {method: 'GET', headers: headers})
            return await req.json()
        },

        /**
         * Cancel all my orders.
         * @param {string=} data.market
         * @param {string=} data.market_type
         * @param {string=} data.side - If present, only sell orders (asks) or buy orders (bids) will be cancelled.
         */
        cancelAllOrders: async function (data) {
            let endpoint = URL + `/market/orders/cancel`
            let formData = new FormData()

            if (data?.market) formData.append("market", data.market)
            if (data?.market_type) formData.append("market_type", data.market_type)
            if (data?.side) formData.append("side", data.side)

            const req = await fetch(`${endpoint}`,
                {method: 'POST', headers: headers, body: formData})
            return await req.json()
        },

        /**
         * Cancel an order.
         * @param {string} id - Id of order
         */
        cancelOrder: async function (id) {
            if (!id) throw Error('Missing Order ID')
            let endpoint = URL + `/market/orders/${id}/cancel`

            const req = await fetch(`${endpoint}`,
                {method: 'POST', headers: headers})
            return await req.json()
        },

        /**
         * Create a Sell/Buy order.
         * @param {object} data
         * @param {string} data.market
         * @param {string} data.side
         * @param {number} data.volume
         * @param {number} data.price
         * @param {string=} data.ord_type
         */
        createOrder: async function (data) {
            if (!(data.market || data.side || data.volume || data.price)) throw Error('Missing arguments')
            let endpoint = URL + `/market/orders`
            let formData = new FormData()

            formData.append("market", data.market)
            formData.append("side", data.side)
            formData.append("volume", data.volume)
            formData.append("price", data.price)
            if (data?.ord_type) formData.append("ord_type", data.ord_type)

            const req = await fetch(`${endpoint}`, {
                method: 'POST',
                headers: {
                    "X-Auth-Apikey": apiKey,
                    "X-Auth-Nonce": Date.now(),
                    "X-Auth-Signature": sign(apiSecret, (Date.now() + apiKey))

                }, body: formData
            })
            return await req.json()
        },

        /**
         * Get your orders, result is paginated.
         * @param {string} data.market
         * @param {string} data.market_type
         * @param {string} data.base_unit
         * @param {string} data.quote_unit
         * @param {string} data.state - Filter order by state.
         * @param {number} data.limit - Limit the number of returned orders, default to 100.
         * @param {number} data.page - Specify the page of paginated results.
         * @param {string} data.order_by - If set, returned orders will be sorted in specific order, default to "desc".
         * @param {string} data.ord_type - Filter order by ord_type.
         * @param {string} data.type - Filter order by type.
         * @param {number} data.time_from - An integer represents the seconds elapsed since Unix epoch.If set, only orders created after the time will be returned.
         * @param {number} data.time_to - An integer represents the seconds elapsed since Unix epoch.If set, only orders created before the time will be returned.
         */
        getAllOrders: async function (data) {
            let endpoint = URL + `/market/orders`
            let params = new url.URLSearchParams()

            if (data?.market) params.append('market', data.market)
            if (data?.market_type) params.append('market_type', data.market_type)
            if (data?.base_unit) params.append('base_unit', data.base_unit)
            if (data?.quote_unit) params.append('quote_unit', data.quote_unit)
            if (data?.state) params.append('state', data.state)
            if (data?.limit) params.append('limit', data.limit)
            if (data?.page) params.append('page', data.page)
            if (data?.order_by) params.append('order_by', data.order_by)
            if (data?.ord_type) params.append('ord_type', data.ord_type)
            if (data?.type) params.append('type', data.type)
            if (data?.time_from) params.append('time_from', data.time_from)
            if (data?.time_to) params.append('time_to', data.time_to)

            const req = await fetch(`${endpoint}?${params.toString()}`,
                {method: 'GET', headers: headers})
            return await req.json()
        },


        getOrder: async function (id) {
            if (!id) throw Error('Missing order ID')
            let endpoint = URL + `/market/orders/${id}`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        }
    }


    this.account = {

        /**
         * Get assets pnl calculated into one currency
         * @param {string} pnl_currency - Currency code in which the PnL is calculated
         */
        getPnL: async function (pnl_currency) {
            let endpoint = URL + `/account/stats/pnl`

            let params = new url.URLSearchParams()
            if (pnl_currency) params.append('pnl_currency', pnl_currency)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get your transactions' history.
         * @param {string} currency - Currency code
         * @param {string} order_by - Sorting order
         * @param {number} time_from - An integer represents the seconds elapsed since Unix epoch.
         * @param {number} time_to - An integer represents the seconds elapsed since Unix epoch.
         * @param {string} deposit_state - Filter deposits by states.
         * @param {string} withdraw_state - Filter withdraws by states.
         * @param {string} txid - Transaction id.
         * @param {number} limit - Limit the number of returned transactions. Default to 100.
         * @param {number} page - Specify the page of paginated results.
         */
        getTransactionHistory: async function (currency, order_by, time_from, time_to, deposit_state, withdraw_state, txid, limit, page) {
            let endpoint = URL + `/account/transactions`
            let params = new url.URLSearchParams()

            if (currency) params.append('currency', currency)
            if (order_by) params.append('order_by', order_by)
            if (time_from) params.append('time_from', time_from)
            if (time_to) params.append('time_to', time_to)
            if (deposit_state) params.append('deposit_state', deposit_state)
            if (withdraw_state) params.append('withdraw_state', withdraw_state)
            if (txid) params.append('txid', txid)
            if (limit) params.append('limit', limit)
            if (page) params.append('page', page)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Creates new withdrawal to active beneficiary.
         * @param {number} otp - OTP to perform action
         * @param {number} beneficiary_id - ID of Active Beneficiary belonging to user.
         * @param {string} currency - The currency code.
         * @param {number} amount - The amount to withdraw.
         * @param {string} note - Optional user metadata to be applied to the transaction. Used to tag transactions with memorable comments.
         */
        makeWithdrawal: async function (otp, beneficiary_id, currency, amount, note) {
            let endpoint = URL + `/account/withdraws`
            let params = new url.URLSearchParams()
            let formData = new FormData()

            formData.append("otp", getOtp())
            formData.append("beneficiary_id", beneficiary_id)
            formData.append("currency", currency)
            formData.append("amount", amount)
            formData.append("note", note)

            const req = await fetch(`${endpoint}`,
                {method: 'POST', body: formData})
            return await req.json()
        },

        /**
         *
         * @param {string} currency - Currency code.
         * @param {number} limit - Number of withdraws per page (defaults to 100, maximum is 100).
         * @param {string} state - Filter withdrawals by states.
         * @param {string} id - Wallet address on the Blockchain.
         * @param {number} time_from - An integer represents the seconds elapsed since Unix epoch.
         * @param {number} time_to - An integer represents the seconds elapsed since Unix epoch.
         * @param {number} page - Page number (defaults to 1).
         */
        getWithdrawals: async function (currency, limit, state, rid, time_from, time_to, page) {
            let endpoint = URL + `/account/withdraws`
            let params = new url.URLSearchParams()

            if (currency) params.append('currency', currency)
            if (limit) params.append('limit', limit)
            if (state) params.append('state', state)
            if (rid) params.append('rid', rid)
            if (time_from) params.append('time_from', time_from)
            if (time_to) params.append('time_to', time_to)
            if (page) params.append('page', page)

            const req = await fetch(`${endpoint}?${params.toString()}`,
                {method: 'GET'})
            return await req.json()
        },


        /**
         * Returns withdrawal sums for last 4 hours and 1 month
         */
        sumWithdrawals: async function () {
            let endpoint = URL + `/account/withdraws/sums`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },
    }


    this.public = {
        /**
         * Returns withdraw limits table as paginated collection
         * @param {string} group - Member group for define withdraw limits.
         * @param {string} kyc_level - KYC level for define withdraw limits.
         * @param {number} limit - Limit the number of returned paginations. Defaults to 100.
         * @param {number} page - Specify the page of paginated results.
         * @param {string} ordering - If set, returned values will be sorted in specific order, defaults to 'asc'.
         * @param {string} order_by - Name of the field, which result will be ordered by.
         */
        getWithdrawLimits: async function (group, kyc_level, limit, page, ordering, order_by) {
            let endpoint = URL + `/public/withdraw_limits`
            let params = new url.URLSearchParams()

            if (group) params.append('group', group)
            if (kyc_level) params.append('kyc_level', kyc_level)
            if (limit) params.append('limit', limit)
            if (page) params.append('page', page)
            if (ordering) params.append('ordering', ordering)
            if (order_by) params.append('order_by', order_by)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Webhook controller
         * @param {string} adapter - Name of adapter for process webhook
         * @param {string} event - Name of event can be deposit or withdraw
         */
        getWebhooks: async function (adapter, event) {
            if (!adapter || !event) throw Error('Missing required "adapter" or "event')
            const endpoint = URL + `/webhooks/${adapter}/${event}`
            const req = await fetch(endpoint, {method: 'GET'})
            return await req.json()
        },

        /**
         * Returns trading_fees table as paginated collection
         * @param {string} group - Member group for define maker/taker fee.
         * @param {string} market_id - Market id for define maker/taker fee.
         * @param {string} market_type - Not documented
         * @param {number} limit - Limit the number of returned paginations. Defaults to 100.
         * @param {number} page - Specify the page of paginated results.
         * @param {string} ordering - If set, returned values will be sorted in specific order, defaults to 'asc'.
         * @param {string} order_by - Name of the field, which result will be ordered by.
         */
        getTradingFees: async function (group, market_id, market_type, limit, page, ordering, order_by) {
            const endpoint = URL + `/public/trading_fees`

            let params = new url.URLSearchParams()
            if (group) params.append('group', group)
            if (market_id) params.append('market_id', market_id)
            if (market_type) params.append('market_type', market_type)
            if (limit) params.append('limit', limit)
            if (page) params.append('page', page)
            if (ordering) params.append('ordering', ordering)
            if (order_by) params.append('order_by', order_by)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get server current time, in seconds since Unix epoch.
         */
        getTimestamp: async function () {
            const endpoint = URL + `/public/timestamp`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get application readiness status
         */
        getReadyStatus: async function () {
            const endpoint = URL + `/public/health/ready`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get application liveness status
         */
        getAliveStatus: async function () {
            const endpoint = URL + `/public/health/alive`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },


        //TODO add all queries
        /**
         * Get all available markets
         * @param {number} limit -    Limit the number of returned paginations. Defaults to 100.
         * @param {number} page - Specify the page of paginated results.
         * @param {string} ordering - If set, returned values will be sorted in specific order, defaults to 'asc'.
         * @param {string} order_by - Name of the field, which result will be ordered by.
         * @param {string} base_unit - Strict filter for base unit
         * @param {string} quote_unit -    Strict filter for quote unit
         * @param {string} type - Strict filter for market type
         */
        getAllMarkets: async function (limit, page, ordering, order_by, base_unit, quote_unit, type) {
            const endpoint = URL + `/public/markets`

            let params = new url.URLSearchParams()
            if (limit) params.append('limit', limit)
            if (page) params.append('page', page)
            if (ordering) params.append('ordering', ordering)
            if (order_by) params.append('order_by', order_by)
            if (base_unit) params.append('base_unit', base_unit)
            if (quote_unit) params.append('quote_unit', quote_unit)
            if (type) params.append('type', type)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get ticker of all markets
         */
        getAllTickers: async function () {
            const endpoint = URL + `/public/markets/tickers`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get ticker of specific market.
         * @param {string} market - required
         */
        getTicker: async function (market) {
            if (!market) throw Error('Missing market argument')
            const endpoint = URL + `/public/markets/${market}/tickers`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get OHLC(k line) of specific market.
         * @param {string} market - required
         * @param {number} period - Time period of K line, default to 1. You can choose between 1, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080
         * @param {number} time_from -    An integer represents the seconds elapsed since Unix epoch. If set, only k-line data after that time will be returned.
         * @param {number} time_to - An integer represents the seconds elapsed since Unix epoch. If set, only k-line data till that time will be returned.
         * @param {number} limit - Limit the number of returned data points default to 30. Ignored if time_from and time_to are given.
         */
        getKLine: async function (market, period, time_from, time_to, limit) {
            if (!market) throw Error('Missing market argument')

            const endpoint = URL + `/public/markets/${market}/k-line`

            let params = new url.URLSearchParams()
            if (period) params.append('period', period)
            if (time_from) params.append('time_from', time_from)
            if (time_to) params.append('time_to', time_to)
            if (limit) params.append('limit', limit)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get depth or specified market. Both asks and bids are sorted from highest price to lowest.
         * @param {string} market - required
         * @param {number} limit - Limit the number of returned price levels. Default to 300.
         */
        getDepth: async function (market, limit) {
            if (!market) throw Error('Missing market argument')

            const endpoint = URL + `/public/markets/${market}/depth`

            let params = new url.URLSearchParams()
            if (limit) params.append('limit', limit)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         *
         * @param {string} market - required
         * @param {number} limit -    Limit the number of returned trades. Default to 100.
         * @param {number} timestamp -    An integer represents the seconds elapsed since Unix epoch.If set, only trades executed before the time will be returned.
         * @param {string} order_by -    If set, returned trades will be sorted in specific order, default to 'desc'.
         */
        getTrades: async function (market, limit, timestamp, order_by) {
            if (!market) throw Error('Missing market argument')

            const endpoint = URL + `/public/markets/${market}/trades`

            let params = new url.URLSearchParams()
            if (limit) params.append('limit', limit)
            if (timestamp) params.append('timestamp', timestamp)
            if (order_by) params.append('order_by', order_by)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get the order book of specified market.
         * @param {object} data
         * @param {string} data.market - required
         * @param {number=} data.asks_limit - Limit the number of returned sell orders. Default to 20.
         * @param {number=} data.bids_limit - Limit the number of returned buy orders. Default to 20.
         */
        getOrderBook: async function (data) {
            if (!data.market) throw Error('Missing market argument')

            const endpoint = URL + `/public/markets/${data.market}/order-book`

            let params = new url.URLSearchParams()
            if (data?.asks_limit) params.append('asks_limit', data.asks_limit)
            if (data?.bids_limit) params.append('timestamp', data.bids_limit)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get list of currencies
         * @param {number} limit - Limit the number of returned paginations. Defaults to 100.
         * @param {number} page - Specify the page of paginated results.
         * @param {string} type - Currency type
         * @param {json} search - not documented
         */
        getAllCurrencies: async function (limit, page, type, search) {
            const endpoint = URL + `/public/currencies`

            let params = new url.URLSearchParams()
            if (limit) params.append('limit', limit)
            if (page) params.append('page', page)
            if (type) params.append('type', type)
            if (search) params.append('search', search)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get a currency
         * @param {string} id - Currency code.
         */
        getCurrency: async function (id) {
            if (!id) throw Error('Missing id argument')

            const endpoint = URL + `/public/currencies/${id}`

            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },
    }
}

const getNonce = () => {

}

const getOtp = () => {
    const secret = process.env.EXBITRON_OTP_SECRET
    return authenticator.generate(secret)
}

const sign = (apiSecret, data) => {
    return crypto.createHmac("sha256", apiSecret).update(data).digest('hex')
}

exports.API = API
