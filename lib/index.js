'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const path = require('path')
const EventEmitter = require('events')
const express = require('express')
const chokidar = require('chokidar')
const tinylr = require('tiny-lr')
const _ = require('lodash')

let createRouter = require('./router')
let errorMiddleware = require('./middleware/error')

function noop () {}

class RunJS extends EventEmitter {
  constructor (opts) {
    super()
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
      this.watch = chokidar.watch(this.opts.dir, {
        ignored: /node_modules|\.git|^\..+|[\/\\]\..+/,
        ignoreInitial: true,
        useFsEvents: !(process.env.NODE_ENV === 'test') // fsevents has issues when testing, not removing the file listeners, causing process to hang
      })

      this.watch.on('ready', () => this.emit('watch:ready'))

      this.watch.on('all', (event, fp) => {
        fp = path.resolve(this.opts.dir, fp)
        this.emit('watch:all', event, fp)
        this.lr.notifyClients([fp])
      })

      this.watch.on('error', err => this.emit('watch:error', err))

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
      this.watch.close()
    }

    this.removeAllListeners()
    this.server.close(cb)
  }

  _createApp () {
    let app = express()

    app.locals.instance = this
    app.locals.opts = this.opts

    this.router = createRouter(this.opts.handlers)
    app.use((req, res, next) => {
      let now = Date.now()
      res.on('finish', () => this.emit('request', req, res, now))
      next()
    })
    app.use(this.router)
    app.use(express.static(this.opts.dir))
    app.use(errorMiddleware)

    return app
  }

  _createLiveReload () {
    let lr = tinylr({ port: 35729 })

    return lr
  }
}

module.exports = RunJS
