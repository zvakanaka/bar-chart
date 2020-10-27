/*
The following code is from Ben Ng: https://www.npmjs.com/package/jstrace-bars
(MIT LICENSE)
 */
/**
 * Module dependencies.
 */

const fmt = require('./printf');

/**
 * Expose `histogram()`.
 */

module.exports = histogram;

/**
 * Return ascii histogram of `data`.
 *
 * @param {Object} data
 * @param {Object} [opts]
 * @return {String}
 * @api public
 */

function histogram(data, opts) {
  opts = opts || { width: 60, bar: '#', map: noop};

  // normalize data
  let barPoints = toArray(data);
  if (opts.sort) barPoints = barPoints.sort(descending);

  let maxKey = max(barPoints.map(point => { return point.key.length }))
  let maxVal = max(barPoints.map(point => { return point.val }));
  let str = '';

  for (const item of barPoints) {
    const p = (item.val / maxVal) || 1;
    const shown = Math.round(opts.width * p);
    const blank = opts.width - shown;
    const bar = Array(shown + 1).join(opts.bar) + Array(blank + 1).join(' ');
    str += fmt('  %*s | %s | %s\n', item.key, maxKey, bar, opts.map(item.val));
  }

  return str;
}

/**
 * Noop map function.
 */

function noop(val) {
  return val;
}

/**
 * Turn object into an array.
 */

function toArray(obj) {
  return Object.keys(obj).map(function (key) {
    return {
      key: key,
      val: obj[key]
    }
  })
}

/**
 * Sort descending.
 */

function descending(a, b) {
  return b.val - a.val;
}

/**
 * Return max in array.
 */

function max(data) {
  let n = data[0];

  for (const item of data) {
    n = item > n ? item : n;
  }

  return n;
}