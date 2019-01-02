import { NodePath } from "@babel/traverse";
import { CallExpression, Comment, CommentBlock } from "@babel/types";

const PURE_ANNOTATION = "#__PURE__";

const isPureAnnotated = (comments: ReadonlyArray<Comment> | null): boolean => {
  if (typeof comments === "undefined") {
    return false;
  }
  if (comments && comments.length > 0) {
    return comments[comments.length - 1].value === PURE_ANNOTATION;
  }
  return false;
};

const createComponentBlock = (value: string): Comment =>
  ({
    type: "CommentBlock",
    value,
  } as CommentBlock);

export default () => ({
  name: "pure-calls-annotation",
  inherits: require("@babel/plugin-syntax-dynamic-import").default,
  visitor: {
    CallExpression: {
      enter(nodePath: NodePath<CallExpression>) {
        if (
          nodePath.parentPath.isVariableDeclarator() ||
          nodePath.parentPath.isAssignmentExpression() ||
          (nodePath.parentPath.isCallExpression() &&
            (
              (nodePath.parentPath.get("arguments") as any) ||
              ([] as NodePath[])
            ).indexOf(nodePath) > -1)
        ) {
          if (!isPureAnnotated(nodePath.node.leadingComments)) {
            const pureAnnotation = createComponentBlock(PURE_ANNOTATION);

            nodePath.replaceWith({
              ...nodePath.node,
              leadingComments: nodePath.node.leadingComments
                ? nodePath.node.leadingComments.concat(pureAnnotation)
                : [pureAnnotation],
            } as any);
          }
        }
      },
    },
  },
});
