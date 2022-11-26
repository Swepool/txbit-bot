// Kryptokrona ©2022
const crypto = require("crypto");
const {fetch} = require('cross-fetch')

const URL = 'https://api.txbit.io/api'

function API(key, secret) {

    const apiKey = key
    const apiSecret = secret
    const nonce = Date.now()

    this.market = {

        /**
         * Used to place a Buy Limit order in a specific market
         * The quantity must be limited to 4 decimal places (0.0000) or you will receive a QUANTITY_INVALID error message when trying to set the order.
         * [Read more]{@link https://apidocs.txbit.io/#market-api}
         * @param market - a string literal for the market (ex: XKR/USDT)
         * @param quantity - the amount to purchase (ex: XKR/USDT)
         * @param rate - the price at which the order will be placed (ex: XKR/USDT)
         */
        buyLimit: async function (market = '', quantity = 0, rate = 0) {
            const endpoint = URL + `/market/buylimit?apikey=${apiKey}&nonce=${nonce}&market=${market}&quantity=${quantity}&rate=${rate}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to place a Sell Limit order in a specific market.
         * The quantity must be limited to 4 decimal places (0.0000) or you will receive a QUANTITY_INVALID error message when trying to set the order.
         * [Read more]{@link https://apidocs.txbit.io/#market-api}
         * @param market - a string literal for the market (ex: XKR/USDT)
         * @param quantity - the amount to purchase (ex: XKR/USDT)
         * @param rate - the price at which the order will be placed (ex: XKR/USDT)
         */
        sellLimit: async function (market = '', quantity = 0, rate = 0) {
            const endpoint = URL + `/market/selllimit?apikey=${apiKey}&nonce=${nonce}&market=${market}&quantity=${quantity}&rate=${rate}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Get all orders that you currently have opened. A specific market can be requested.
         * [Read more]{@link https://apidocs.txbit.io/#market-api}
         * @param market - a string literal for the market (ex: XKR/USDT)
         */
        getOpenOrders: async function (market = '') {
            const endpoint = URL + `/market/getopenorders?apikey=${apiKey}&nonce=${nonce}&market=${market}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to cancel a buy or sell order.
         * [Read more]{@link https://apidocs.txbit.io/#market-api}
         * @param orderId - uuid of buy or sell order
         */
        this: async function (orderId = '') {
            const endpoint = URL + `/market/cancel?apikey=${apiKey}&nonce=${nonce}&uuid=${orderId}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        }
    }

    this.account = {

        /**
         * Used to retrieve all balances from your account.
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         */
        getBalances: async function () {
            const endpoint = URL + `/account/getbalances?apikey=${apiKey}&nonce=${nonce}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to retrieve the balance from your account for a specific asset.
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         * @param currency - a string literal for the market (ex: XKR)
         */
        getBalance: async function (currency = '') {
            const endpoint = URL + `/account/getbalance?apikey=${apiKey}&nonce=${nonce}&currency=${currency}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to retrieve or generate an address for a specific currency. If one does not exist, the call will fail and return ADDRESS_GENERATING until one is available
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         * @param currency - a string literal for the market (ex: XKR)
         */
        getDepositAddress: async function (currency = '') {
            const endpoint = URL + `/account/getdepositaddress?apikey=${apiKey}&nonce=${nonce}&currency=${currency}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to withdraw funds from your account. Note: please account for txfee.
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         * @param currency - a string literal for the market (ex: XKR)
         * @param quantity - amount to withdraw
         * @param address - asset will be sent to this address
         */
        withdraw: async function (currency = '', quantity = 0, address = '') {
            const endpoint = URL + `/account/withdraw?apikey=${apiKey}&nonce=${nonce}&currency=${currency}&quantity=${quantity}&address=${address}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to retrieve a single order by uuid.
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         * @param orderId - the uuid of the buy or sell order
         */
        getOrder: async function (orderId = '') {
            const endpoint = URL + `/account/getorder?apikey=${apiKey}&nonce=${nonce}&uuid=${orderId}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to retrieve your order history.
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         */
        getOrderHistory: async function () {
            const endpoint = URL + `/account/getorderhistory?apikey=${apiKey}&nonce=${nonce}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to retrieve your withdrawal history.
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         * @param currency - a string literal for the asset (ie. XKR). If omitted, will return for all assets.
         */
        getWithdrawalHistory: async function (currency = '') {
            const endpoint = URL + `/account/getwithdrawalhistory?apikey=${apiKey}&nonce=${nonce}?currency=${currency}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        },

        /**
         * Used to retrieve your deposit history.
         * [Read more]{@link https://apidocs.txbit.io/#account-api}
         * @param currency - a string literal for the asset (ie. XKR). If omitted, will return for all assets.
         */
        getDepositHistory: async function (currency = '') {
            const endpoint = URL + `/account/getdeposithistory?apikey=${apiKey}&nonce=${nonce}?currency=${currency}`
            const req = await fetch(endpoint, {
                headers: {apisign: sign(endpoint, apiSecret)}
            })
            return await req.json()
        }
    }

    this.public = {
        /**
         * Used to get the open and available trading markets at Txbit.io along with other meta data.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         */
        getMarkets: async function () {
            const req = await fetch(URL + '/public/getmarkets')
            return await req.json()
        },

        /**
         * Used to get all supported assets on Txbit.io along with other meta data.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         */
        getCurrencies: async function () {
            const req = await fetch(URL + '/public/getcurrencies')
            return await req.json()
        },

        /**
         * Used to get current tick values for a market.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         * @param market -    a string literal for the market (ex: XKR/USDT)
         */
        getTicker: async function (market = '') {
            const req = await fetch(URL + `/public/getticker?market=${market}`)
            return await req.json()
        },

        /**
         * Used to get the last 24 hour summary of all active markets.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         */
        getMarketSummaries: async function () {
            const req = await fetch(URL + `/public/getmarketsummaries`)
            return await req.json()
        },

        /**
         * Used to get the last 24 hour summary of a specific market.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         * @param market - a string literal for the market (ex: XKR/USDT)
         */
        getMarketSummary: async function (market = '') {
            const req = await fetch(URL + `/public/getmarketsummary?market=${market}`)
            return await req.json()
        },

        /**
         * Used to get retrieve the orderbook for a given market.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         * @param market - a string literal for the market (ex: XKR/USDT)
         * @param type - buy, sell or both to return specific type of orderbook
         */
        getOrderBook: async function (market = '', type = 'both') {
            const req = await fetch(URL + `/public/getorderbook?market=${market}&type=${type}`)
            return await req.json()
        },

        /**
         * Used to retrieve the latest trades that have occurred for a specific market.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         * @param market - a string literal for the market (ex: XKR/USDT)
         */
        getMarketHistory: async function (market = '') {
            const req = await fetch(URL + `/public/getmarkethistory?market=${market}`)
            return await req.json()
        },

        /**
         * Used to retrieve the system related status for all currencies listed on Txbit, such as can the currency be deposited, withdrawn or traded. How many pending deposits and withdrawals there are and a development note if it exists.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         */
        getSystemStatus: async function () {
            const req = await fetch(URL + `/public/getsystemstatus`)
            return await req.json()
        },

        /**
         * Used to retrieve specific information and metadata about the listed currency on Txbit.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         * @param currency - a string literal for the currency (ex: XKR)
         */
        getCurrencyInformation: async function (currency = '') {
            const req = await fetch(URL + `/public/getcurrencyinformation?currency=${currency}`)
            return await req.json()
        },

        /**
         * Used to retrieve solvency information for listed currencies on Txbit. See the current Hot wallet and Cold wallet balances, Total deposits and withdrawals and the final balance to prove solvency. All calculated in real time.
         * [Read more]{@link https://apidocs.txbit.io/#public-api}
         * @param currency - a string literal for the currency (ex: XKR)
         */
        getCurrencyBalanceSheet: async function (currency = '') {
            const req = await fetch(URL + `/public/getcurrencybalancesheet?currency=${currency}`)
            return await req.json()
        }
    }
}

const sign = (endpoint, apiSecret) => {
    return crypto.createHmac("sha512", apiSecret).update(endpoint).digest('hex').toUpperCase()
}

exports.API = API