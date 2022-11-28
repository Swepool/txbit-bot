const clc = require("cli-color");
const TxBit = require('./api/txbit');
require('dotenv').config()

const TXBIT_KEY = process.env.TXBIT_API_KEY
const TXBIT_SECRET = process.env.TXBIT_API_SECRET

const txbit = new TxBit.API(TXBIT_KEY, TXBIT_SECRET)

const main = async () => {

    console.log(clc.green('BOT STARTED 🚨'))

    console.log(await txbit.public.getSystemStatus())
    txbit.account.getDepositHistory()
    //Build something cool 😎
}

main()