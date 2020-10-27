const barChart = require('../index')
const timeout = ms => new Promise((resolve, reject) => setTimeout(() => resolve(ms), ms))

// test the usual
console.log(barChart([
  { label: 'smiles per day', count: 143 },
  { label: 'laughs', count: 340 },
  { label: 'high fives', count: 26 }
]));

// test progress bar
(async () => {
  const n = 100 // number of times to call promise
  await sequentialPromiseAll(timeout, [1000], n, (argsHandle, previousResponse, i) => {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    const count = (i + 1) / n * 100
    const outputBar = barChart([{ label: `${i + 1}/${n}`, count }], { percentages: true })
    process.stdout.write(outputBar)
    argsHandle[0] = Math.max(previousResponse - 40, 10) // speed up over time
  })
})()

/**
 *
 * @param {*} func function that returns a promise (will be called n times after previous one resolves)
 * @param {*} args arguments array provided to promise (timeout)
 * @param {*} num number of times to call promise
 * @param {*} callback invoked after each promise resolution that accept
 */
function sequentialPromiseAll (func, args, num, callback) {
  return new Promise((resolve, reject) => {
    const responses = []
    const arr = Array.from(Array(num), (d, i) => i)
    arr.reduce(async (p, item, i) => {
      const lastResponse = await p
      if (lastResponse) {
        responses.push(lastResponse)
        if (callback) { callback(args, lastResponse, i) }
      }
      return func(...args)
    }, Promise.resolve()).then((lastResponse) => {
      responses.push(lastResponse)
      resolve(responses)
    }).catch((err) => {
      console.warn(err, responses)
      reject(responses)
    })
  })
}
