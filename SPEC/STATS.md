Stats API
=======

#### `bitswap`

`stats.bitswap` and `bitswap.stat` can be used interchangeably. See [`bitswap.stat`](./BITSWAP.md#stat) for more details.

#### `repo`

`stats.repo` and `repo.stat` can be used interchangeably. See [`repo.stat`](./REPO.md#stat) for more details.

#### `bw`

> Adds an IPFS object to the pinset and also stores it to the IPFS repo. pinset is the set of hashes currently pinned (not gc'able).

##### `Go` **WIP**

##### `JavaScript` - ipfs.stats.bw([options, callback])

Where:

- `options` is an opcional object that might contain the following keys:
  - `peer` specifies a peer to print bandwidth for.
  - `proto` specifies a protocol to print bandwidth for.
  - `poll` is used to print bandwidth at an interval.
  - `interval` is the time interval to wait between updating output, if `poll` is true.

`callback` must follow `function (err, stat) {}` signature, where `err` is an Error if the operation was not successful.

`stat` is, in both cases, an Object containing the following keys:

- `totalIn` - is a [Big Int][1], in bytes.
- `totalOut` - is a [Big Int][1], in bytes.
- `rateIn` - is a [Big Int][1], in bytes.
- `rateOut` - is a [Big Int][1], in bytes.

If no `callback` is passed, a promise is returned.

**Example:**

```JavaScript
ipfs.stats.bw((err, stats) => console.log(stats))

// { totalIn: Big {...},
//   totalOut: Big {...},
//   rateIn: Big {...},
//   rateOut: Big {...} }
```

#### `bwPoll`

> Adds an IPFS object to the pinset and also stores it to the IPFS repo. pinset is the set of hashes currently pinned (not gc'able).

##### `Go` **WIP**

##### `JavaScript` - ipfs.stats.bwPoll([options, callback])

Parameters and stats Objects are the same as on [`ipfs.stats.bw`](#bw).

`callback` must follow `function (err, stream) {}` signature, where `err` is an error if the operation was not successful and `stream` is a (X?) Stream.

If no `callback` is passed, a promise is returned.

**Example:**

```JavaScript
ipfs.stats.bwPoll((err, stream) => {
  // TODO:
})

// { totalIn: Big {...},
//   totalOut: Big {...},
//   rateIn: Big {...},
//   rateOut: Big {...} }
```

[1]: https://github.com/MikeMcl/big.js/
