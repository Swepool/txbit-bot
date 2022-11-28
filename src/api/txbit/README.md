# Txbit API wrapper

### Example
```js
const Txbit = require('txbit-api-wrapper')

const txbit = new Txbit.API(KEY, SECRET)

const main = async () => {
    console.log(await txbit.account.buyLimit('XKR/USDT', 1337, 0.003))
}
main()
```