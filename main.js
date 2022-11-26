const clc = require("cli-color");
const TxBit = require('./txbit');

require('dotenv').config()

// NEVER SHARE YOUR KEYS
const KEY = process.env.API_KEY
const SECRET = process.env.API_SECRET

const publicApi = new TxBit.Public()
const accountApi = new TxBit.Account(KEY, SECRET)
const marketApi = new TxBit.Market(KEY, SECRET)

console.log(clc.green('BOT STARTED 🥳'))

//NOW, BUILD SOMETHING COOL BELOW 😎🤙