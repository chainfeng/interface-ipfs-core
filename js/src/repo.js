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
  describe('.repo', () => {
    let ipfs

    before(function (done) {
      // CI takes longer to instantiate the daemon, so we need to increase the
      // timeout for the before step
      this.timeout(60 * 1000)

      common.setup((err, factory) => {
        expect(err).to.not.exist()
        factory.spawnNode((err, node) => {
          expect(err).to.not.exist()
          ipfs = node
          done()
        })
      })
    })

    after((done) => {
      common.teardown(done)
    })

    it('.version', (done) => {
      ipfs.repo.version((err, version) => {
        expect(err).to.not.exist()
        expect(version).to.exist()
        done()
      })
    })

    it('.version Promise', () => {
      return ipfs.repo.version().then((version) => {
        expect(version).to.exist()
      })
    })

    it('.stat', (done) => {
      ipfs.repo.stat((err, res) => {
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

    it('.stat Promise', () => {
      return ipfs.repo.stat().then((res) => {
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

    it('.gc', (done) => {
      ipfs.repo.gc((err, res) => {
        expect(err).to.not.exist()
        expect(res).to.exist()
        done()
      })
    })

    it('.gc Promise', () => {
      return ipfs.repo.gc().then((res) => {
        expect(res).to.exist()
      })
    })
  })
}
