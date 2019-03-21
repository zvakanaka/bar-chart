const barChart = require('../index');
const timeout = (ms) => new Promise((res) => setTimeout(() => res(ms), ms));

// test the usual
console.log(barChart([
  {label: 'smiles per day', count: 143},
  {label: 'laughs', count: 340},
  {label: 'high fives', count: 26}
]));

// test progress bar
(async () => {
  const arr = Array.from(Array(100), (d, i) => i); // fill array with n values 0..100
  await sequentialPromiseAll(timeout, [10], arr.length, (_args, _previousResponse, i) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const count = (i + 1) / arr.length * 100;
    const output = barChart([{label: `${i + 1}/${arr.length}`, count}], {percentages: true});
    process.stdout.write(output); // end the line
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
