# txbit-bot
Just a template with an API wrapper written in JavaScript to build trading bots for TxBit.io

Txbit api docs - https://apidocs.txbit.io

# Setup
Create a `.env` file in root and enter your key & secret created at TxBit.io
You can have a look at `.env-example` for reference. Double check the api key-pair permissions as well.

Then build your bot in `main.js` and run `npm run start`

example:

```js
const TXBIT_KEY = process.env.TXBIT_API_KEY
const TXBIT_SECRET = process.env.TXBIT_API_SECRET

const txbit = new TxBit.API(TXBIT_KEY, TXBIT_SECRET)

const main = async () => {
  await txbit.market.buyLimit('XKR/USDT', 1337, 0.003)
}

main()
```

# TODO
- Error handling

# Contributors

The following contributors have either helped to start this project, have contributed
code, are actively maintaining it (including documentation), or in other ways
being awesome contributors to this project. **We'd like to take a moment to recognize them.**

[<img src="https://avatars.githubusercontent.com/u/36674091?v=4?size=72" alt="Swepool" width="72">](https://github.com/Swepool)
