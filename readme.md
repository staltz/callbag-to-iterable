# callbag-to-iterable

Convert a synchronous pullable callbag source to an Iterable.

`npm install callbag-to-iterable`

## example

Convert an Iterable to a synchronous pullable callbag, apply some operators, then convert back to Iterable and consume it with a `for of` loop:

```js
const {forEach, fromIter, take, map, pipe} = require('callbag-basics');
const toIterable = require('callbag-to-iterable');

function* range(from, to) {
  let i = from;
  while (i <= to) {
    yield i;
    i++;
  }
}

const result = pipe(
  fromIter(range(40, 99)), // 40, 41, 42, 43, 44, 45, 46, ...
  take(5), // 40, 41, 42, 43, 44
  map(x => x / 4), // 10, 10.25, 10.5, 10.75, 11
  toIterable
);

for (let x of result) {
  console.log(x)
}
// 10
// 10.25
// 10.5
// 10.75
// 11
```
