function* toIterable(source) {
  let talkback;
  let hasVal = false;
  let val;
  source(0, (t, d) => {
    if (t === 0) talkback = d;
    else if (t === 1) {
      val = d;
      hasVal = true;
    }
    else if (t === 2) talkback = false;
  });
  while (talkback) {
    talkback(1);
    if (hasVal) {
      yield val;
      hasVal = false;
    } else {
      if (talkback) talkback(2);
      return;
    }
  }
}

module.exports = toIterable;
