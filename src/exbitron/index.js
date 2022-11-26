// Kryptokrona ©2022
const crypto = require("crypto");
const {fetch} = require('cross-fetch')

const URL = 'https://www.exbitron.com/api/v2/peatio'

function API(key , secret ) {

    const apiKey = key
    const apiSecret = secret
    const nonce = Date.now()
    const headers = {
        headers: {
            "X-Auth-Apikey": apiKey,
            "X-Auth-Nonce": nonce,
            "X-Auth-Signature": sign(apiSecret, (nonce + apiKey))
        }
    }

    this.getBalances = async function () {
        const endpoint = URL + `/account/balances`
        const req = await fetch(endpoint, headers)
        return await req.json()
    }
}

const sign = (apiSecret, data) => {
    return crypto.createHmac("sha256",apiSecret).update(data).digest('hex')
}

exports.API = API
