## babel-plugin-annotate-pure-call-in-variable-declarator

[![Build Status](https://img.shields.io/travis/morlay/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://travis-ci.org/morlay/babel-plugin-annotate-pure-call-in-variable-declarator)
[![NPM](https://img.shields.io/npm/v/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-annotate-pure-call-in-variable-declarator)
[![Dependencies](https://img.shields.io/david/morlay/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://david-dm.org/morlay/babel-plugin-annotate-pure-call-in-variable-declarator)
[![License](https://img.shields.io/npm/l/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-annotate-pure-call-in-variable-declarator)

Automated annotating with **#__PURE__** comment to call expressions in assignment contexts.

### Purpose

Help to annotate with **#__PURE__** in order to drop dead code when using [UglifyJS](https://github.com/mishoo/UglifyJS2).


Will transform

```js
export const call = (s) => {
  return "call" + s
}

export const stringA = call("a")
export const stringB = (() => call("b"))()
```

to

```js
export const call = (s) => {
  return "call" + s
}

export const stringA = /*#__PURE__*/call("a")
export const stringB = /*#__PURE__*/(() => call("b"))()
```
