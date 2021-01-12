const bars = require('./lib/jstrace-bars');
const commatize = val => Number(val).toLocaleString('en');
const percentagize = (val) => `${Math.floor(val)}%`.padStart(4, ' ');

/**
 * Print a bar chart that is the width of the console
 * @param  {Object[]} objectArray e.g. [{label: 'Thing 1', count: 150}, {label: 'Thing 2', count: 250}]
 * @return {String}               bar chart string
 */
function barChart(objectArray, options = {percentages: false}) {
  let labelMax; // max string length for label - will be updated
  let countMax; // max string length for count - will be updated

  if (options.percentages) objectArray.push({label: '', count: 100}); // percentage adjuster - will be removed later
  // value mapping
  const obj = objectArray.reduce((previous, current) => {
    if (!previous[current.label]) 
      previous[current.label] = current.count;
    else 
      previous[current.label] += current.count;

    const countLength = options.percentages ? percentagize(current.count).length : commatize(current.count).length;

    if (labelMax === undefined || current.label.length > labelMax) 
      labelMax = current.label.length;
    if (countMax === undefined || countLength > countMax) 
      countMax = countLength;

    return previous;
  }, {});

  const [consoleWidth, consoleHeight] = process.stdout.isTTY ? process.stdout.getWindowSize() : [100, 100];
  const barWidth = consoleWidth - (2 + labelMax + 3 + 3 + countMax);
  const barsOutput = bars(obj, { bar: '█', width: barWidth, sort: false, map: options.percentages ? percentagize : commatize });
  if (objectArray.length > 0 && options.percentages) {
    const barsOuputTruncated = barsOutput.split('\n').slice(0, barsOutput.split('\n').length - 2);
    return barsOuputTruncated.join('\n').trim('\n');
  }
  return barsOutput;
}

module.exports = barChart;
