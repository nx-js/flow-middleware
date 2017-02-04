'use strict'

const dom = require('@nx-js/dom-util')

const secret = {
  inited: Symbol('flow initialized'),
  showing: Symbol('flow showing'),
  prevArray: Symbol('flow prevArray'),
  trackBy: Symbol('track by')
}

function flow (elem) {
  if (elem.nodeType !== 1) return

  elem.$attribute('if', {
    init: initFlow,
    handler: ifAttribute
  })
  elem.$attribute('track-by', {
    handler: trackByAttribute,
    type: ['', '$']
  })
  elem.$attribute('repeat', {
    init: initFlow,
    handler: repeatAttribute
  })
}
flow.$name = 'flow'
flow.$require = ['attributes']
module.exports = flow

function initFlow () {
  if (this[secret.inited]) {
    throw new Error('The if and repeat attributes can not be used on the same element')
  }
  dom.normalizeContent(this)
  dom.extractContent(this)
  this[secret.inited] = true
}

function ifAttribute (show) {
  if (show && !this[secret.showing]) {
    dom.insertContent(this)
    this[secret.showing] = true
  } else if (!show && this[secret.showing]) {
    dom.clearContent(this)
    this[secret.showing] = false
  }
}

function trackByAttribute (trackBy) {
  this[secret.trackBy] = trackBy
}

function repeatAttribute (array) {
  const repeatValue = this.getAttribute('repeat-value') || '$value'
  const repeatIndex = this.getAttribute('repeat-index') || '$index'

  let trackBy = this[secret.trackBy] || isSame
  let trackByProp
  if (typeof trackBy === 'string') {
    trackByProp = trackBy
    trackBy = isSame
  }

  array = array || []
  const prevArray = this[secret.prevArray] = this[secret.prevArray] || []

  let i = -1
  iteration: for (let item of array) {
    let prevItem = prevArray[++i]

    if (prevItem === item) {
      continue
    }
    if (trackBy(item, prevItem, trackByProp)) {
      dom.mutateContext(this, i, {[repeatValue]: item})
      prevArray[i] = item
      continue
    }
    for (let j = i + 1; j < prevArray.length; j++) {
      prevItem = prevArray[j]
      if (trackBy(item, prevItem, trackByProp)) {
        dom.moveContent(this, j, i, {[repeatIndex]: i})
        prevArray.splice(i, 0, prevItem)
        prevArray.splice(j, 1)
        continue iteration
      }
    }
    dom.insertContent(this, i, {[repeatIndex]: i, [repeatValue]: item})
    prevArray.splice(i, 0, item)
  }

  if ((++i) === 0) {
    prevArray.length = 0
    dom.clearContent(this)
  } else {
    while (i < prevArray.length) {
      dom.removeContent(this)
      prevArray.pop()
    }
  }
}

function isSame (item1, item2, prop) {
  return (item1 === item2 ||
    (prop && typeof item1 === 'object' && typeof item2 === 'object' &&
    item1 && item2 && item1[prop] === item2[prop]))
}
