## babel-plugin-pure-calls-annotation

[![test](https://img.shields.io/github/workflow/status/morlay/babel-plugin-pure-calls-annotation/test?style=flat-square)](https://github.com/morlay/babel-plugin-pure-calls-annotation/actions/workflows/test.yml)
[![codecov](https://img.shields.io/codecov/c/github/morlay/babel-plugin-pure-calls-annotation?style=flat-square)](https://codecov.io/gh/morlay/babel-plugin-pure-calls-annotation)
[![npm](https://img.shields.io/npm/v/babel-plugin-pure-calls-annotation?style=flat-square)](https://npmjs.org/package/babel-plugin-pure-calls-annotation)
[![dep](https://img.shields.io/librariesio/release/npm/babel-plugin-pure-calls-annotation?style=flat-square)](https://libraries.io/github/morlay/babel-plugin-pure-calls-annotation)

Automated annotate **`/*#__PURE__*/`** to call expression which in **variable declarator**,
**assignment expression** and **arguments of call expression**

### Purpose

help to annotate **`/*#__PURE__*/`** to drop dead code in [Webpack](https://github.com/webpack/webpack)
for uglyfiy and tree shaking

Will transform

```typescript
export const call = (s) => {
    return "call" + s
}

export const stringA = call("a")
export const stringB = (() => call("b"))()
```

to

```typescript
export const call = (s) => {
    return "call" + s
}

export const stringA = /*#__PURE__*/call("a")
export const stringB = /*#__PURE__*/(() => call("b"))()
```

Notice:

code like below will not be pure call

```typescript
const a = setInterval(() => {
    console.log(a)
}, 1000)
```
