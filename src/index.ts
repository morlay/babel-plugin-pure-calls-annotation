import { NodePath } from "@babel/traverse";
import {
  CallExpression,
  Comment,
  CommentBlock,
  Identifier,
} from "@babel/types";

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

const isVariableUsedInCallback = (nodePath: NodePath<any>) => {
  let used = false;

  const scope = nodePath.parentPath.scope;

  nodePath.traverse({
    ReferencedIdentifier(n: NodePath<Identifier>) {
      if (scope.hasOwnBinding(n.node.name)) {
        used = true;
      }
    },
  } as any);

  return used;
};

const isPureCall = (nodePath: NodePath<CallExpression>) => {
  if (nodePath.parentPath.isAssignmentExpression()) {
    return nodePath;
  }

  if (nodePath.parentPath.isVariableDeclarator()) {
    return !isVariableUsedInCallback(nodePath);
  }

  if (
    nodePath.parentPath.isCallExpression() &&
    (
      (nodePath.parentPath.get("arguments") as any) || ([] as NodePath[])
    ).indexOf(nodePath) > -1
  ) {
    return true;
  }

  return false;
};

export default () => ({
  name: "pure-calls-annotation",
  inherits: require("@babel/plugin-syntax-dynamic-import").default,
  visitor: {
    CallExpression: {
      enter(nodePath: NodePath<CallExpression>) {
        if (isPureCall(nodePath)) {
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
