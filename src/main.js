const clc = require("cli-color");
const TxBit = require('./txbit');
const Exbitron = require('./exbitron')

require('dotenv').config()

// NEVER SHARE YOUR KEYS
const TXBIT_KEY = process.env.TXBIT_API_KEY
const TXBIT_SECRET = process.env.TXBIT_API_SECRET
const EXBITRON_KEY = process.env.EXBITRON_API_KEY
const EXBITRON_SECRET = process.env.EXBITRON_API_SECRET

const txbitPublic = new TxBit.Public()
const txbitAccount = new TxBit.Account(TXBIT_KEY, TXBIT_SECRET)
const txbitMarket = new TxBit.Market(TXBIT_KEY, TXBIT_SECRET)
const exbitron = new Exbitron.API(EXBITRON_KEY, EXBITRON_SECRET)

console.log(clc.green('BOT STARTED 🥳'))

const main = async () => {

    //JUST A TEST, YOU CAN REMOVE THIS
    //console.log(await accountApi.getBalance('BTC'))

    //NOW, BUILD SOMETHING COOL BELOW 😎🤙
    console.log(await exbitron.getBalances())
}

main()