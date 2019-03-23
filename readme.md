## Examples
### Chart
```js
const barChart = require('bar-charts');

console.log(barChart([
  {label: 'smiles per day', count: 143},
  {label: 'laughs', count: 340},
  {label: 'high fives', count: 26}
]));
```
#### output
```
smiles per day | ███████████████████                            | 143
        laughs | ██████████████████████████████████████████████ | 340
    high fives | ████                                           | 26
```
### Progress bar
```js
const barChart = require('bar-charts');
const sequentialPromiseAll = require('sequential-promise-all');
const timeout = ms => new Promise(res => setTimeout(() => res(ms), ms));

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
```
#### output
```
 84/100 | ████████████████████████████████████████████████████ |  84%
```

## Credits
[jstrace-bars](https://github.com/jstrace/bars)  
[printf](https://github.com/adaltas/node-printf)
