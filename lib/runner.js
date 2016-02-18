'use babel'

import fs from 'fs-plus'
import path from 'path'

import glob from 'glob'
import ipc from 'ipc'
import Jasmine from 'jasmine'
import TerminalReporter from 'jasmine-terminal-reporter'

export default function Runner (basePath) {
  return function ({testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate}) {
    const jasmine = new Jasmine()
    window.jasmine = jasmine
    window.atom = buildAtomEnvironment({
      applicationDelegate: buildDefaultApplicationDelegate(),
      window: window,
      document: document,
      configDirPath: process.env.ATOM_HOME,
      enablePersistence: false
    })

    // TODO: ask @maxbrunsfeld why we are assigning allll these globals, cf https://github.com/atom/atom/blob/04ecef7b8c69104bb2945a26d1ddcdd722744055/spec/jasmine-helper.coffee#L8
    // for(let key of Object.keys(jasmine)) {
    //   window[key] = jasmine[key]
    // }

    // jasmine.loadConfig({
    //   spec_dir: 'spec',
    //   spec_files: ['spec/test-spec.js'],
    //   helpers: ['helpers/*.js']
    // })

    const promise = new Promise((resolve, reject) => {
      const reporter = new TerminalReporter({
        includeStackTrace: true,
        done: (passed) => {
          if (passed) {
            resolve(0)
          } else {
            resolve(1)
          }
        },
        print: str => ipc.send('write-to-stderr', str)
      })

      jasmine.addReporter(reporter)

      const globs = testPaths.map((specPath) => {
        return glob.sync(specPath).reduce((a, b) => { return a.concat(b) })
      })
      const paths = globs.map((specPath) => {
        let actualPath = specPath
        if (fs.statSync(specPath).isDirectory()) {
          actualPath = path.join(specPath, '*-spec.js')
        }
        return path.relative(path.resolve(path.join(basePath)), actualPath)
      })

      jasmine.execute(paths)
    })

    return promise
  }
}
