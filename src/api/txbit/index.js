// Swepool ©2022
const crypto = require("crypto");
const {fetch} = require('cross-fetch')
const url = require("url");

const URL = 'https://api.txbit.io/api'

function API(key, secret) {

  const apiKey = key
  const apiSecret = secret

  this.market = {

    /**
     * Used to place a Buy Limit order in a specific market
     * The quantity must be limited to 4 decimal places (0.0000) or you will receive a QUANTITY_INVALID error message when trying to set the order.
     * [Read more]{@link https://apidocs.txbit.io/#market-api}
     * @param {string} market - a string literal for the market (ex: XKR/USDT)
     * @param {number} quantity - the amount to purchase
     * @param {number} rate - the price at which the order will be placed
     * @return {Promise<any>}
     */
    buyLimit: async function (market, quantity, rate) {
      if (!(market || rate || quantity)) throw Error('Missing argument')
      const endpoint = URL + `/market/buylimit?apikey=${apiKey}&nonce=${Date.now()}&market=${market.toUpperCase()}&quantity=${quantity}&rate=${rate}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to place a Sell Limit order in a specific market.
     * The quantity must be limited to 4 decimal places (0.0000) or you will receive a QUANTITY_INVALID error message when trying to set the order.
     * [Read more]{@link https://apidocs.txbit.io/#market-api}
     * @param {string} market - a string literal for the market (ex: XKR/USDT)
     * @param {number} quantity - the amount to purchase
     * @param {number} rate - the price at which the order will be placed
     * @return {Promise<any>}
     */
    sellLimit: async function (market, quantity, rate) {
      if (!(market || rate || quantity)) throw Error('Missing argument')
      const endpoint = URL + `/market/selllimit?apikey=${apiKey}&nonce=${Date.now()}&market=${market.toUpperCase()}&quantity=${quantity}&rate=${rate}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Get all orders that you currently have opened. A specific market can be requested.
     * [Read more]{@link https://apidocs.txbit.io/#market-api}
     * @param {string=} market - a string literal for the market (ex: XKR/USDT)
     * @return {Promise<any>}
     */
    getOpenOrders: async function (market) {
      const endpoint = URL + `/market/getopenorders?apikey=${apiKey}&nonce=${Date.now()}`

      let params = new url.URLSearchParams()
      if (market) params.append('market', market.toUpperCase())
      const fullUrl = `${endpoint}${params.toString()}`

      try {
        const req = await fetch(fullUrl, {
          headers: {apisign: sign(fullUrl, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to cancel a buy or sell order.
     * [Read more]{@link https://apidocs.txbit.io/#market-api}
     * @param {string} orderId - uuid of buy or sell order
     * @return {Promise<any>}
     */
    cancelOrder: async function (orderId) {
      if (!orderId) throw Error('Missing argument')
      const endpoint = URL + `/market/cancel?apikey=${apiKey}&nonce=${Date.now()}&uuid=${orderId}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    }
  }

  this.account = {

    /**
     * Used to retrieve all balances from your account.
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @return {Promise<any>}
     */
    getBalances: async function () {
      const endpoint = URL + `/account/getbalances?apikey=${apiKey}&nonce=${Date.now()}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve the balance from your account for a specific asset.
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @param {string} currency - a string literal for the market (ex: XKR)
     * @return {Promise<any>}
     */
    getBalance: async function (currency) {
      if (!currency) throw Error('Missing argument')
      const endpoint = URL + `/account/getbalance?apikey=${apiKey}&nonce=${Date.now()}&currency=${currency.toUpperCase()}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve or generate an address for a specific currency. If one does not exist, the call will fail and return ADDRESS_GENERATING until one is available
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @param {string} currency - a string literal for the market (ex: XKR)
     * @return {Promise<any>}
     */
    getDepositAddress: async function (currency) {
      if (!currency) throw Error('Missing argument')
      const endpoint = URL + `/account/getdepositaddress?apikey=${apiKey}&nonce=${Date.now()}&currency=${currency.toUpperCase()}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to withdraw funds from your account. Note: please account for txfee.
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @param {string} currency - a string literal for the market (ex: XKR)
     * @param {number} quantity - amount to withdraw
     * @param {string} address - asset will be sent to this address
     * @return {Promise<any>}
     */
    withdraw: async function (currency, quantity, address) {
      if (!(currency || address || quantity)) throw Error('Missing argument')
      const endpoint = URL + `/account/withdraw?apikey=${apiKey}&nonce=${Date.now()}`

      let params = new url.URLSearchParams()
      if (currency) params.append('currency', currency.toUpperCase())
      if (address) params.append('address', address)
      if (quantity) params.append('quantity', quantity)

      const fullUrl = `${endpoint}&${params.toString()}`

      try {
        const req = await fetch(fullUrl, {
          headers: {apisign: sign(fullUrl, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }

    },

    /**
     * Used to retrieve a single order by uuid.
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @param {string} orderId - the uuid of the buy or sell order
     * @return {Promise<any>}
     */
    getOrder: async function (orderId) {
      if (!orderId) throw Error('Missing argument')
      const endpoint = URL + `/account/getorder?apikey=${apiKey}&nonce=${Date.now()}&uuid=${orderId}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve your order history.
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @return {Promise<any>}
     */
    getOrderHistory: async function () {
      const endpoint = URL + `/account/getorderhistory?apikey=${apiKey}&nonce=${Date.now()}`

      try {
        const req = await fetch(endpoint, {
          headers: {apisign: sign(endpoint, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }

    },

    /**
     * Used to retrieve your withdrawal history.
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @param {string=} currency - a string literal for the asset (ie. XKR). If omitted, will return for all assets.
     * @return {Promise<any>}
     */
    getWithdrawalHistory: async function (currency) {
      const endpoint = URL + `/account/getwithdrawalhistory?apikey=${apiKey}&nonce=${Date.now()}`

      let params = new url.URLSearchParams()
      if (currency) params.append('currency', currency.toUpperCase())

      const fullUrl = `${endpoint}${params.toString()}`

      try {
        const req = await fetch(fullUrl, {
          headers: {apisign: sign(fullUrl, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve your deposit history.
     * [Read more]{@link https://apidocs.txbit.io/#account-api}
     * @param {string=} currency - a string literal for the asset (ie. XKR). If omitted, will return for all assets.
     * @return {Promise<any>}
     */
    getDepositHistory: async function (currency) {
      const endpoint = URL + `/account/getdeposithistory?apikey=${apiKey}&nonce=${Date.now()}`

      let params = new url.URLSearchParams()
      if (currency) params.append('currency', currency.toUpperCase())

      const fullUrl = `${endpoint}${params.toString()}`
      try {
        const req = await fetch(fullUrl, {
          headers: {apisign: sign(fullUrl, apiSecret)}
        })
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    }
  }

  this.public = {
    /**
     * Used to get the open and available trading markets at Txbit.io along with other meta data.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @return {Promise<any>}
     */
    getMarkets: async function () {
      try {
        const req = await fetch(URL + '/public/getmarkets')
        return await req.json()
      } catch (e) {
        console.log(e)
      }

    },

    /**
     * Used to get all supported assets on Txbit.io along with other meta data.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @return {Promise<any>}
     */
    getCurrencies: async function () {
      try {
        const req = await fetch(URL + '/public/getcurrencies')
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to get current tick values for a market.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @param {string} market - a string literal for the market (ex: XKR/USDT)
     * @return {Promise<any>}
     */
    getTicker: async function (market) {
      if (!market) throw Error('Missing argument')
      try {
        const req = await fetch(URL + `/public/getticker?market=${market.toUpperCase()}`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to get the last 24 hour summary of all active markets.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @return {Promise<any>}
     */
    getMarketSummaries: async function () {
      try {
        const req = await fetch(URL + `/public/getmarketsummaries`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to get the last 24 hour summary of a specific market.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @param {string} market - a string literal for the market (ex: XKR/USDT)
     * @return {Promise<any>}
     */
    getMarketSummary: async function (market) {
      if (!market) throw Error('Missing argument')
      try {
        const req = await fetch(URL + `/public/getmarketsummary?market=${market.toUpperCase()}`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to get retrieve the orderbook for a given market.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @param {string} market - a string literal for the market (ex: XKR/USDT)
     * @param {string=} type - buy, sell or both to return specific type of orderbook
     * @return {Promise<any>}
     */
    getOrderBook: async function (market = '', type = 'both') {
      if (!market) throw Error('Missing argument')
      try {
        const req = await fetch(URL + `/public/getorderbook?market=${market.toUpperCase()}&type=${type.toLowerCase()}`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve the latest trades that have occurred for a specific market.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @param {string}market - a string literal for the market (ex: XKR/USDT)
     * @return {Promise<any>}
     */
    getMarketHistory: async function (market) {
      if (!market) throw Error('Missing argument')
      try {
        const req = await fetch(URL + `/public/getmarkethistory?market=${market.toUpperCase()}`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve the system related status for all currencies listed on Txbit, such as can the currency be deposited, withdrawn or traded. How many pending deposits and withdrawals there are and a development note if it exists.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @return {Promise<any>}
     */
    getSystemStatus: async function () {
      try {
        const req = await fetch(URL + `/public/getsystemstatus`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve specific information and metadata about the listed currency on Txbit.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @param {string} currency - a string literal for the currency (ex: XKR)
     * @return {Promise<any>}
     */
    getCurrencyInformation: async function (currency) {
      if (!currency) throw Error('Missing argument')
      try {
        const req = await fetch(URL + `/public/getcurrencyinformation?currency=${currency.toUpperCase()}`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * Used to retrieve solvency information for listed currencies on Txbit. See the current Hot wallet and Cold wallet balances, Total deposits and withdrawals and the final balance to prove solvency. All calculated in real time.
     * [Read more]{@link https://apidocs.txbit.io/#public-api}
     * @param {string} currency - a string literal for the currency (ex: XKR)
     * @return {Promise<any>}
     */
    getCurrencyBalanceSheet: async function (currency) {
      if (!currency) throw Error('Missing argument')
      try {
        const req = await fetch(URL + `/public/getcurrencybalancesheet?currency=${currency.toUpperCase()}`)
        return await req.json()
      } catch (e) {
        console.log(e)
      }
    }
  }
}

const sign = (endpoint, apiSecret) => {
  return crypto.createHmac("sha512", apiSecret).update(endpoint).digest('hex').toUpperCase()
}

exports.API = API
