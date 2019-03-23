const barChart = require('../index');
const timeout = ms => new Promise(res => setTimeout(() => res(ms), ms));

// test the usual
console.log(barChart([
  {label: 'smiles per day', count: 143},
  {label: 'laughs', count: 340},
  {label: 'high fives', count: 26}
]));

// test progress bar
(async () => {
  const n = 100; // number of times to call promise
  await sequentialPromiseAll(
    timeout, // function that returns a promise (will be called n times after previous one resolves)
    [1000], // arguments array provided to promise (timeout)
    n, // number of times to call promise
    ( // callback - invoked after each promise resolution
    argsHandle, // modify this in the callback to change the arguments at the next invocation
    previousResponse, // what is resolved from promise (timeout)
    i) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const count = (i + 1) / n * 100;
    const outputStr = barChart([{label: `${i + 1}/${n}`, count}], {percentages: true});
    process.stdout.write(outputStr); // print the bar
    argsHandle[0] = Math.max(previousResponse - 40, 10); // speed up over time
  });
})();

function sequentialPromiseAll(func, args, num, updateCb) {
  return new Promise((resolve, reject) => {
    const responses = [];
    const arr = Array.from(Array(num), (d, i) => i);
    arr.reduce((p, item, i) => {
      return p.then((lastResponse) => {
        if (lastResponse) {
          responses.push(lastResponse);
          if (updateCb) updateCb(args, lastResponse, i);
        }
        return func(...args);
      });
    }, Promise.resolve()).then((lastResponse) => {
      responses.push(lastResponse);
      resolve(responses);
    }).catch((err) => {
      console.warn(err, responses);
      reject(responses);
    });
  });
}
