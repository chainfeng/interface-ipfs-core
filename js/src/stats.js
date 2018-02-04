/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */

'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const Big = require('big.js')
chai.use(dirtyChai)

const isBigInt = (n) => {
  try {
    new Big(n)
    return true
  } catch (e) {
    return false
  }
}

const expectIsBitswap = (err, stats) => {
  expect(err).to.not.exist()
  expect(stats).to.exist()
  expect(stats).to.have.a.property('provideBufLen')
  expect(stats).to.have.a.property('wantlist')
  expect(stats).to.have.a.property('peers')
  expect(stats).to.have.a.property('blocksReceived')
  expect(stats).to.have.a.property('dataReceived')
  expect(stats).to.have.a.property('blocksSent')
  expect(stats).to.have.a.property('dataSent')
  expect(stats).to.have.a.property('dupBlksReceived')
  expect(stats).to.have.a.property('dupDataReceived')

  expect(isBigInt(stats.provideBufLen)).to.eql(true)
  expect(stats.wantlist).to.be.an('array')
  expect(stats.peers).to.be.an('array')
  expect(isBigInt(stats.blocksReceived)).to.eql(true)
  expect(isBigInt(stats.dataReceived)).to.eql(true)
  expect(isBigInt(stats.blocksSent)).to.eql(true)
  expect(isBigInt(stats.dataSent)).to.eql(true)
  expect(isBigInt(stats.dupBlksReceived)).to.eql(true)
  expect(isBigInt(stats.dupDataReceived)).to.eql(true)
}

const expectIsBandwidth = (err, stats) => {
  expect(err).to.not.exist()
  expect(stats).to.exist()
  expect(stats).to.have.a.property('totalIn')
  expect(stats).to.have.a.property('totalOut')
  expect(stats).to.have.a.property('rateIn')
  expect(stats).to.have.a.property('rateOut')
  expect(isBigInt(stats.totalIn)).to.eql(true)
  expect(isBigInt(stats.totalOut)).to.eql(true)
  expect(isBigInt(stats.rateIn)).to.eql(true)
  expect(isBigInt(stats.rateOut)).to.eql(true)
}

const expectIsRepo = (err, res) => {
  expect(err).to.not.exist()
  expect(res).to.exist()
  expect(res).to.have.a.property('numObjects')
  expect(res).to.have.a.property('repoSize')
  expect(res).to.have.a.property('repoPath')
  expect(res).to.have.a.property('version')
  expect(res).to.have.a.property('storageMax')
  expect(isBigInt(res.numObjects)).to.eql(true)
  expect(isBigInt(res.repoSize)).to.eql(true)
  expect(isBigInt(res.storageMax)).to.eql(true)
  expect(res.repoPath).to.be.a('string')
  expect(res.version).to.be.a('string')
}

module.exports = (common) => {
  describe('.stats', () => {
    let ipfs
    let withGo

    before(function (done) {
      // CI takes longer to instantiate the daemon, so we need to increase the
      // timeout for the before step
      this.timeout(60 * 1000)

      common.setup((err, factory) => {
        expect(err).to.not.exist()
        factory.spawnNode((err, node) => {
          expect(err).to.not.exist()
          ipfs = node
          node.id((err, id) => {
            expect(err).to.not.exist()
            withGo = id.agentVersion.startsWith('go-ipfs')
            done()
          })
        })
      })
    })

    after((done) => {
      common.teardown(done)
    })

    it('.bitswap', (done) => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return done()
      }

      ipfs.stats.bitswap((err, res) => {
        expectIsBitswap(err, res)
        done()
      })
    })

    it('.bitswap Promise', () => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return
      }

      return ipfs.stats.bitswap().then((res) => {
        expectIsBitswap(null, res)
      })
    })

    it('.bw', (done) => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return done()
      }

      ipfs.stats.bw((err, res) => {
        expectIsBandwidth(err, res)
        done()
      })
    })

    it('.bw Poll', (done) => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return done()
      }

      ipfs.stats.bw({poll: true}, (err, res) => {
        expect(err).to.not.exist()
        expect(res).to.exist()

        res.once('data', (data) => {
          expectIsBandwidth(null, data)
          done()
          res.destroy()
        })
      })
    })

    it('.bw Promise', () => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return
      }

      return ipfs.stats.bw().then((res) => {
        expectIsBandwidth(null, res)
      })
    })

    it('.bw Promise Poll', (done) => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return
      }

      ipfs.stats.bw({poll: true}).then((res) => {
        expect(res).to.exist()

        res.once('data', (data) => {
          expectIsBandwidth(null, data)
          done()
          res.destroy()
        })
      }).catch(done)
    })

    it('.repo', (done) => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return done()
      }

      ipfs.stats.repo((err, res) => {
        expectIsRepo(err, res)
        done()
      })
    })

    it('.repo Promise', () => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return
      }

      return ipfs.stats.repo().then((res) => {
        expectIsRepo(null, res)
      })
    })
  })
}
