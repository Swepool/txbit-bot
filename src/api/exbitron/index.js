// Kryptokrona ©2022
const crypto = require("crypto");
const {fetch} = require('cross-fetch')
const url = require('url')

const URL = 'https://www.exbitron.com/api/v2/peatio'

function API(key, secret) {

    const apiKey = key
    const apiSecret = secret
    const nonce = Date.now()

    const headers = {
            "X-Auth-Apikey": apiKey,
            "X-Auth-Nonce": nonce,
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


    this.market = {}


    this.account = {}


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
        withdrawLimits: async function (group, kyc_level, limit, page, ordering, order_by) {
            const args = {group, kyc_level, limit, page, ordering, order_by}
            let endpoint = URL + `/public/withdraw_limits`
            let params = new url.URLSearchParams()

            if(group) params.append('group', group)
            if(kyc_level) params.append('kyc_level', kyc_level)
            if(limit) params.append('limit', limit)
            if(page) params.append('page', page)
            if(ordering) params.append('ordering', ordering)
            if(order_by) params.append('order_by', order_by)

            console.log(`${endpoint}?${params.toString()}`)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Webhook controller
         * @param {string} adapter - Name of adapter for process webhook
         * @param {string} event - Name of event can be deposit or withdraw
         */
        webhooks: async function (adapter, event) {
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
        tradingFees: async function (group, market_id, market_type, limit, page, ordering, order_by) {
            const endpoint = URL + `/public/trading_fees`

            let params = new url.URLSearchParams()
            if(group) params.append('group', group)
            if(market_id) params.append('market_id', market_id)
            if(market_type) params.append('market_type', market_type)
            if(limit) params.append('limit', limit)
            if(page) params.append('page', page)
            if(ordering) params.append('ordering', ordering)
            if(order_by) params.append('order_by', order_by)

            const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
            return await req.json()
        },

        /**
         * Get server current time, in seconds since Unix epoch.
         */
        timestamp: async function () {
            const endpoint = URL + `/public/timestamp`
            const req = await fetch(`${endpoint}`, {method: 'GET'})
            return await req.json()
        },

        health: {
            /**
             * Get application readiness status
             */
            ready: async function () {
                const endpoint = URL + `/public/health/ready`
                const req = await fetch(`${endpoint}`, {method: 'GET'})
                return await req.json()
            },

            /**
             * Get application liveness status
             */
            alive: async function () {
                const endpoint = URL + `/public/health/alive`
                const req = await fetch(`${endpoint}`, {method: 'GET'})
                return await req.json()
            },
        },

        markets: {

            /**
             * Get ticker of all markets
             */
            tickers: async function () {
                const endpoint = URL + `/public/markets/tickers`
                const req = await fetch(`${endpoint}`, {method: 'GET'})
                return await req.json()
            },
        },

        market: {

            /**
             * Get ticker of specific market.
             * @param {string} market - required
             */
            ticker: async function (market) {
                if(!market) throw Error('Missing market argument')
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
            kLine: async function (market, period, time_from, time_to, limit) {
                if(!market) throw Error('Missing market argument')

                const endpoint = URL + `/public/markets/${market}/k-line`

                let params = new url.URLSearchParams()
                if(period) params.append('period', period)
                if(time_from) params.append('time_from', time_from)
                if(time_to) params.append('time_to', time_to)
                if(limit) params.append('limit', limit)

                const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
                return await req.json()
            },

            /**
             * Get depth or specified market. Both asks and bids are sorted from highest price to lowest.
             * @param {string} market - required
             * @param {number} limit - Limit the number of returned price levels. Default to 300.
             */
            depth: async function (market, limit) {
                if(!market) throw Error('Missing market argument')

                const endpoint = URL + `/public/markets/${market}/depth`

                let params = new url.URLSearchParams()
                if(limit) params.append('limit', limit)

                const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
                return await req.json()
            },

            /**
             *
             * @param {string} market - required
             * @param {number} limit - 	Limit the number of returned trades. Default to 100.
             * @param {number} timestamp - 	An integer represents the seconds elapsed since Unix epoch.If set, only trades executed before the time will be returned.
             * @param {string} order_by - 	If set, returned trades will be sorted in specific order, default to 'desc'.
             * @returns {Promise<any>}
             */
            trades: async function (market, limit, timestamp, order_by) {
                if(!market) throw Error('Missing market argument')

                const endpoint = URL + `/public/markets/${market}/trades`

                let params = new url.URLSearchParams()
                if(limit) params.append('limit', limit)
                if(timestamp) params.append('timestamp', timestamp)
                if(order_by) params.append('order_by', order_by)

                const req = await fetch(`${endpoint}?${params.toString()}`, {method: 'GET'})
                return await req.json()
            },
        },

    }

}

const sign = (apiSecret, data) => {
    return crypto.createHmac("sha256", apiSecret).update(data).digest('hex')
}

exports.API = API
