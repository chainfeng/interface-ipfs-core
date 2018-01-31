/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */

'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const Big = require('big.js')
chai.use(dirtyChai)

const isNumber = (n) => {
  try {
    new Big(n)
    return true
  } catch (e) {
    return false
  }
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
        expect(err).to.not.exist()
        expect(res).to.exist()
        expect(res).to.have.a.property('provideBufLen')
        expect(res).to.have.a.property('wantlist')
        expect(res).to.have.a.property('peers')
        expect(res).to.have.a.property('blocksReceived')
        expect(res).to.have.a.property('dataReceived')
        expect(res).to.have.a.property('blocksSent')
        expect(res).to.have.a.property('dataSent')
        expect(res).to.have.a.property('dupBlksReceived')
        expect(res).to.have.a.property('dupDataReceived')

        expect(isNumber(res.provideBufLen)).to.eql(true)
        expect(res.wantlist).to.be.an('array')
        expect(res.peers).to.be.an('array')
        expect(isNumber(res.blocksReceived)).to.eql(true)
        expect(isNumber(res.dataReceived)).to.eql(true)
        expect(isNumber(res.blocksSent)).to.eql(true)
        expect(isNumber(res.dataSent)).to.eql(true)
        expect(isNumber(res.dupBlksReceived)).to.eql(true)
        expect(isNumber(res.dupDataReceived)).to.eql(true)
        done()
      })
    })

    it('.bitswap Promise', () => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return
      }

      return ipfs.stats.bitswap().then((res) => {
        expect(res).to.exist()
        expect(res).to.have.a.property('provideBufLen')
        expect(res).to.have.a.property('wantlist')
        expect(res).to.have.a.property('peers')
        expect(res).to.have.a.property('blocksReceived')
        expect(res).to.have.a.property('dataReceived')
        expect(res).to.have.a.property('blocksSent')
        expect(res).to.have.a.property('dataSent')
        expect(res).to.have.a.property('dupBlksReceived')
        expect(res).to.have.a.property('dupDataReceived')

        expect(isNumber(res.provideBufLen)).to.eql(true)
        expect(res.wantlist).to.be.an('array')
        expect(res.peers).to.be.an('array')
        expect(isNumber(res.blocksReceived)).to.eql(true)
        expect(isNumber(res.dataReceived)).to.eql(true)
        expect(isNumber(res.blocksSent)).to.eql(true)
        expect(isNumber(res.dataSent)).to.eql(true)
        expect(isNumber(res.dupBlksReceived)).to.eql(true)
        expect(isNumber(res.dupDataReceived)).to.eql(true)
      })
    })

    it('.bw', (done) => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return done()
      }

      ipfs.stats.bw((err, res) => {
        expect(err).to.not.exist()
        expect(res).to.exist()
        expect(res).to.have.a.property('totalIn')
        expect(res).to.have.a.property('totalOut')
        expect(res).to.have.a.property('rateIn')
        expect(res).to.have.a.property('rateOut')
        expect(isNumber(res.totalIn)).to.eql(true)
        expect(isNumber(res.totalOut)).to.eql(true)
        expect(isNumber(res.rateIn)).to.eql(true)
        expect(isNumber(res.rateOut)).to.eql(true)
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
          expect(data).to.have.a.property('totalIn')
          expect(data).to.have.a.property('totalOut')
          expect(data).to.have.a.property('rateIn')
          expect(data).to.have.a.property('rateOut')
          expect(isNumber(data.totalIn)).to.eql(true)
          expect(isNumber(data.totalOut)).to.eql(true)
          expect(isNumber(data.rateIn)).to.eql(true)
          expect(isNumber(data.rateOut)).to.eql(true)
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
        expect(res).to.exist()
        expect(res).to.have.a.property('totalIn')
        expect(res).to.have.a.property('totalOut')
        expect(res).to.have.a.property('rateIn')
        expect(res).to.have.a.property('rateOut')
        expect(isNumber(res.totalIn)).to.eql(true)
        expect(isNumber(res.totalOut)).to.eql(true)
        expect(isNumber(res.rateIn)).to.eql(true)
        expect(isNumber(res.rateOut)).to.eql(true)
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
          expect(data).to.have.a.property('totalIn')
          expect(data).to.have.a.property('totalOut')
          expect(data).to.have.a.property('rateIn')
          expect(data).to.have.a.property('rateOut')
          expect(isNumber(data.totalIn)).to.eql(true)
          expect(isNumber(data.totalOut)).to.eql(true)
          expect(isNumber(data.rateIn)).to.eql(true)
          expect(isNumber(data.rateOut)).to.eql(true)
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
        expect(err).to.not.exist()
        expect(res).to.exist()
        expect(res).to.have.a.property('numObjects')
        expect(res).to.have.a.property('repoSize')
        expect(res).to.have.a.property('repoPath')
        expect(res).to.have.a.property('version')
        expect(res).to.have.a.property('storageMax')
        expect(isNumber(res.numObjects)).to.eql(true)
        expect(isNumber(res.repoSize)).to.eql(true)
        expect(isNumber(res.storageMax)).to.eql(true)
        expect(res.repoPath).to.be.a('string')
        expect(res.version).to.be.a('string')
        done()
      })
    })

    it('.repo Promise', () => {
      if (!withGo) {
        console.log('Not supported in js-ipfs yet')
        return
      }

      return ipfs.stats.repo().then((res) => {
        expect(res).to.exist()
        expect(res).to.have.a.property('numObjects')
        expect(res).to.have.a.property('repoSize')
        expect(res).to.have.a.property('repoPath')
        expect(res).to.have.a.property('version')
        expect(res).to.have.a.property('storageMax')
        expect(isNumber(res.numObjects)).to.eql(true)
        expect(isNumber(res.repoSize)).to.eql(true)
        expect(isNumber(res.storageMax)).to.eql(true)
        expect(res.repoPath).to.be.a('string')
        expect(res.version).to.be.a('string')
      })
    })
  })
}
