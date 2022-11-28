const clc = require("cli-color");
const TxBit = require('./api/txbit');
const Exbitron = require('./api/exbitron')
require('dotenv').config()

const TXBIT_KEY = process.env.TXBIT_API_KEY
const TXBIT_SECRET = process.env.TXBIT_API_SECRET
const EXBITRON_KEY = process.env.EXBITRON_API_KEY
const EXBITRON_SECRET = process.env.EXBITRON_API_SECRET

const txbit = new TxBit.API(TXBIT_KEY, TXBIT_SECRET)
const exbitron = new Exbitron.API(EXBITRON_KEY, EXBITRON_SECRET)

const main = async () => {

    console.log(clc.green('BOT STARTED 🚨'))

    
}

main()