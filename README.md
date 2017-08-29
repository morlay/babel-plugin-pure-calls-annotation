## babel-plugin-annotate-pure-call-in-variable-declarator

[![Build Status](https://img.shields.io/travis/morlay/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://travis-ci.org/morlay/babel-plugin-annotate-pure-call-in-variable-declarator)
[![NPM](https://img.shields.io/npm/v/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-annotate-pure-call-in-variable-declarator)
[![Dependencies](https://img.shields.io/david/morlay/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://david-dm.org/morlay/babel-plugin-annotate-pure-call-in-variable-declarator)
[![License](https://img.shields.io/npm/l/babel-plugin-annotate-pure-call-in-variable-declarator.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-annotate-pure-call-in-variable-declarator)

Automated annotate **#__PURE__** to call expression which in **variable declarator**, 
**assignment expression** and **arguments of call expression**

### Purpose

help to annotate **#__PURE__** to drop dead code in [Webpack](https://github.com/webpack/webpack) 
for uglyfiy and tree shaking


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