'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const express = require('express')
const Gaze = require('gaze').Gaze
const tinylr = require('tiny-lr')
const _ = require('lodash')

let createRouter = require('./router')
let errorHandler = require('./routes/error-handler')

function noop () {}

class RunJS {
  constructor (opts) {
    this.opts = opts || {}
    _.defaults(this.opts, {
      dir: process.cwd(),
      watch: true,
      port: 60274,
      handlers: [],
      transforms: [],
      plugins: []
    })

    this.app = this._createApp()
    if (this.opts.watch) this.lr = this._createLiveReload()
  }

  start (cb) {
    if (!cb) cb = noop

    if (this.opts.watch) {
      this.gaze = new Gaze(['**/*', '!node_modules/**'], { cwd: this.opts.dir })

      this.gaze.on('ready', () => console.log('Live reloading enabled.'))
      this.gaze.on('all', (event, fp) => {
        this.lr.notifyClients([fp])
      })
      this.gaze.on('error', err => {
        console.error(err)
      })

      this.lr.listen()
    }

    this.server = this.app.listen(this.opts.port, cb)
  }

  stop (cb) {
    if (!cb) cb = noop

    if (!this.server) {
      return cb(new Error('No server currently running.'))
    }

    if (this.opts.watch) {
      this.lr.close()
      this.gaze.close()
    }
    this.server.close(cb)
  }

  _createApp () {
    let app = express()

    app.locals.opts = this.opts

    this.router = createRouter(this.opts.handlers)
    app.use(this.router)
    app.use(express.static(this.opts.dir))
    app.use(errorHandler)

    return app
  }

  _createLiveReload () {
    let lr = tinylr({ port: 35729 })

    return lr
  }
}

module.exports = RunJS
