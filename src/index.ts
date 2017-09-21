import * as syntax from "babel-plugin-syntax-dynamic-import"
import {
  Node,
  NodePath,
} from "babel-traverse"
import {
  Comment,
  CommentBlock,
} from "babel-types"

const createCommentBlock = (value: string): Comment => ({
  type: "CommentBlock",
  value,
}) as CommentBlock

const PURE_ANNOTATION = "#__PURE__"

const isPureAnnotated = (nodePath: NodePath<Node>): boolean => {
  const { leadingComments } = nodePath.node

  if (leadingComments === undefined) {
    return false
  }

  return /[@#]__PURE__/.test(leadingComments[leadingComments.length - 1].value)
}

const annotateAsPure = (nodePath: NodePath<Node>) => {
  if (isPureAnnotated(nodePath)) {
    return;
  }

  const node = nodePath.node;
  node.leadingComments = (node.leadingComments || []).concat(createCommentBlock(PURE_ANNOTATION))
}

const isTopLevel = (nodePath: NodePath<Node>): boolean => {
  return nodePath.getStatementParent().parentPath.isProgram()
}

export default () => ({
  inherits: syntax,
  visitor: {
    CallExpression(nodePath: NodePath<Node>) {
      if (!isTopLevel(nodePath)) {
        let functionParent

        do {
          functionParent = (functionParent || nodePath).getFunctionParent()

          if (!functionParent.parentPath.isCallExpression()) {
            return
          }
        } while (!isTopLevel(functionParent))
      }

      const statement = nodePath.getStatementParent()
      let parentPath

      do {
        ({ parentPath } = parentPath || nodePath)

        if (parentPath.isVariableDeclaration() || parentPath.isAssignmentExpression()) {
          annotateAsPure(nodePath)
          return
        }
      } while (parentPath !== statement)
    },
  },
})
