[![npm version](https://badge.fury.io/js/%40ta-kiyama%2Fimgen.svg)](https://badge.fury.io/js/%40ta-kiyama%2Fimgen)

# imgen
immutable generator generator for node.js

# install

`npm install -D @ta-kiyama/imgen`

# sample

## sync generator function

```js
import imgen from "@ta-kiyama/imgen";

const itr = imgen(function* (arg) {
  const result = yield arg;
  yield result * 2;
  yield 3;
});

itr.next(1); // { value: 1, done: false }

itr.next(1); // { value: 1, done: false }

itr
  .next(1)
  .next(2); // { value: 4, done: false }

itr
  .next(1)
  .next(2)
  .next(); // { value: 3, done: false }

itr
  .next(1)
  .next(2)
  .next()
  .next(); // { value: undefined, done: true }

itr.next(1); // { value: 1, done: false }
```

## async generator function

```js
import imgen from "@ta-kiyama/imgen";

const itr = imgen(async function* (arg) {
  const result = yield arg;
  await new Promise((r) => setTimeout(r, 1000));
  yield result * 2;
  yield 3;
});

await itr
  .next(1)
  .toPromise(); // { value: 1, done: false }

await itr.next(1); // { value: 1, done: false }

await itr
  .next(1)
  .next(2)
  .toPromise(); // { value: 4, done: false } ※after 1sec

itr
  .next(1)
  .next(2)
  .next()
  .toPromise(); // { value: 3, done: false } ※after 1sec

itr
  .next(1)
  .next(2)
  .next()
  .next()
  .toPromise(); // { value: undefined, done: true } ※after 1sec

itr
  .next(1)
  .toPromise(); // { value: 1, done: false }
```
