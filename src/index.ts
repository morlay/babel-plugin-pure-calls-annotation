import * as syntax from "babel-plugin-syntax-dynamic-import";
import { Node, NodePath } from "babel-traverse";
import { Comment, CommentBlock } from "babel-types";

const PURE_ANNOTATION = "#__PURE__";

const isPureAnnotated = (comments?: Comment[]): boolean => {
  if (typeof comments === "undefined") {
    return false;
  }
  if (comments.length > 0) {
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
  inherits: syntax,
  visitor: {
    CallExpression: {
      enter(nodePath: NodePath<Node>) {
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
            });
          }
        }
      },
    },
  },
});
