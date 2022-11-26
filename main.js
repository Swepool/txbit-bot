const clc = require("cli-color");
const TxBit = require('./txbit');

// NEVER SHARE YOUR KEYS
const KEY = 'ENTER KEY'
const SECRET = 'ENTER SECRET'

const publicApi = new TxBit.Public()
const accountApi = new TxBit.Account(KEY, SECRET)
const marketApi = new TxBit.Market(KEY, SECRET)

console.log(clc.green('BOT STARTED 🥳'))

//NOW, BUILD SOMETHING COOL BELOW 😎🤙