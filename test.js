const test = require('tape');
const fromIter = require('../callbag-basics').fromIter;
const toIterable = require('./index');

test('it converts a sync pullable source to iterable', t => {
  t.plan(9);
  const upwardsExpected = [
    [0, 'function'],
    [1, 'undefined'],
    [1, 'undefined'],
    [1, 'undefined'],
    [1, 'undefined'],
  ];
  const downwardsExpected = [10, 20, 30];

  function makeSource() {
    let _sink;
    let sent = 0;
    const source = (type, data) => {
      const e = upwardsExpected.shift();
      t.deepEquals([type, typeof data], e, 'upwards is expected: ' + e);

      if (type === 0) {
        _sink = data;
        _sink(0, source);
        return;
      }
      if (sent === 3) {
        _sink(2);
        return;
      }
      if (sent === 0) {
        sent++;
        _sink(1, 10);
        return;
      }
      if (sent === 1) {
        sent++;
        _sink(1, 20);
        return;
      }
      if (sent === 2) {
        sent++;
        _sink(1, 30);
        return;
      }
    };
    return source;
  }

  const source = makeSource();
  const iterable = toIterable(source);

  for (let x of iterable) {
    const e = downwardsExpected.shift();
    t.equals(x, e, 'downwards is expected: ' + e);
  }

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 300);
});

test('it bails out when a pulled value doesnt come asap (synchronously)', t => {
  t.plan(8);
  const upwardsExpected = [
    [0, 'function'],
    [1, 'undefined'],
    [1, 'undefined'],
    [1, 'undefined'],
    [2, 'undefined']
  ];
  const downwardsExpected = [10, 20];

  function makeSource() {
    let _sink;
    let sent = 0;
    const source = (type, data) => {
      const e = upwardsExpected.shift();
      t.deepEquals([type, typeof data], e, 'upwards is expected: ' + e);

      if (type === 0) {
        _sink = data;
        _sink(0, source);
        return;
      }
      if (sent === 0) {
        sent++;
        _sink(1, 10);
        return;
      }
      if (sent === 1) {
        sent++;
        _sink(1, 20);
        return;
      }
      if (sent === 2) {
        sent++;
        setTimeout(() => {
          _sink(1, 30);
        }, 10);
        return;
      }
    };
    return source;
  }

  const source = makeSource();
  const iterable = toIterable(source);

  for (let x of iterable) {
    const e = downwardsExpected.shift();
    t.equals(x, e, 'downwards is expected: ' + e);
  }

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 300);
});


test('it does not blow up the stack when iterating something huge', t => {
  t.plan(1);
  let i = 0;
  function* gen() {
    while (i < 1000000) {
      yield i++;
    }
  }
  const source = fromIter(gen());
  const outIterable = toIterable(source);

  for (let x of outIterable) {
    void 0;
  }
  t.equals(i, 1000000, '1 million items were iterated');
});
