## babel-plugin-annotate-pure-call-in-variable-declarator

Automated annotate **#__PURE__** to call expression which in variable declarator

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