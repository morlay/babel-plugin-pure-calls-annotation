import { transform } from "babel-core"
import pluginAnnotatePureCallInVariableDeclarator from "../"

const cases = [{
  title: "Annotated #__PURE__",
  src: `const A = String("a");`,
  dest: `const A = /*#__PURE__*/String("a");`,
}, {
  title: "Annotated #__PURE__ in assignment expression",
  src: `A = String("a");`,
  dest: `A = /*#__PURE__*/String("a");`,
}, {
  title: "Annotated #__PURE__ multiline",
  src: `const A = String("a");
const B = String("b");`,
  dest: `const A = /*#__PURE__*/String("a");
const B = /*#__PURE__*/String("b");`,
}, {
  title: "Skip #__PURE__ for side effect fn()",
  src: `fn();`,
  dest: `fn();`,
}, {
  // only: true,
  title: "Skip #__PURE__ for side effect fn()()()",
  src: `fn()()();`,
  dest: `fn()()();`,
}, {
  title: "Skip annotated #__PURE__ when already have",
  src: `const A = /*#__PURE__*/String("a");`,
  dest: `const A = /*#__PURE__*/String("a");`,
}, {
  title: "Annotated #__PURE__ with other comments",
  src: `const A = /*other comments*/String("a");`,
  dest: `const A = /*other comments*/ /*#__PURE__*/String("a");`,
}, {
  title: "Annotated #__PURE__ when export",
  src: `export const A = String("a");`,
  dest: `export const A = /*#__PURE__*/String("a");`,
}, {
  title: "Annotated #__PURE__ for IIFE",
  src: `export const A = (() => "a")();`,
  dest: `export const A = /*#__PURE__*/(() => "a")();`,
}, {
  title: "Annotated #__PURE__ for import()",
  src: `export const A = import("")`,
  dest: `export const A = /*#__PURE__*/import("");`,
}, {
  title: "Annotated #__PURE__ for fn(fn())",
  src: `export const A = fn(fn())`,
  dest: `export const A = /*#__PURE__*/fn( /*#__PURE__*/fn());`,
}]

function unPad(str: string) {
  return str.replace(/^\n+|\n+$/, "").replace(/\n+/g, "\n")
}

describe("test cases", () => {
  cases.forEach((caseItem) => {
    ((caseItem as any).only ? it.only : it)(caseItem.title, () => {
      const code = transform(caseItem.src, {
        plugins: [
          pluginAnnotatePureCallInVariableDeclarator,
        ],
      }).code
      expect(unPad(code || "")).toEqual(unPad(caseItem.dest))
    })
  })
})
