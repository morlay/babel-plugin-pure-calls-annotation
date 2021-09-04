import { NodePath } from "@babel/traverse";
import {
  ArrowFunctionExpression,
  CallExpression,
  Comment,
  CommentBlock,
  FunctionExpression,
  Identifier,
  VariableDeclarator,
} from "@babel/types";

const PURE_ANNOTATION = "#__PURE__";

const isPureAnnotated = (comments: ReadonlyArray<Comment> | null): boolean => {
  if (comments && comments.length > 0) {
    return comments[comments.length - 1].value === PURE_ANNOTATION;
  }
  return false;
};

const containsNodePath = (nodePaths: NodePath[], nodePath: NodePath) => {
  return nodePaths.indexOf(nodePath) > -1;
};

const createComponentBlock = (value: string): Comment =>
  ({
    type: "CommentBlock",
    value,
  } as CommentBlock);

const isDeclaredVariableUsedInCallback = (
  nodePath: NodePath<CallExpression>,
) => {
  let used = false;

  if (nodePath.parentPath.isVariableDeclarator()) {
    const scope = nodePath.parentPath.scope;
    const id = (nodePath.parentPath as NodePath<VariableDeclarator>).get("id");

    const traverseReferencedIdentifier = (np: NodePath<any>) =>
      np.traverse({
        ReferencedIdentifier(n: NodePath<Identifier>) {
          if (scope.hasOwnBinding(n.node.name)) {
            if (id.isIdentifier()) {
              if (id.node.name === n.node.name) {
                used = true;
              }
            }
          }
        },
      } as any);

    nodePath.traverse({
      ArrowFunctionExpression: (
        nodePath: NodePath<ArrowFunctionExpression>,
      ) => {
        traverseReferencedIdentifier(nodePath);
      },
      FunctionExpression: (nodePath: NodePath<FunctionExpression>) => {
        traverseReferencedIdentifier(nodePath);
      },
    });
  }

  return used;
};

const isPureCall = (nodePath: NodePath<CallExpression>) => {
  // x = pureCall()
  // a.x = pureCall()
  if (nodePath.parentPath.isAssignmentExpression()) {
    return true;
  }

  // [pureCall()]
  if (nodePath.parentPath.isArrayExpression()) {
    return true;
  }

  // ({ x: prueCall(0,1) })
  if (nodePath.parentPath.isProperty()) {
    return true;
  }

  // const x = pureCall()
  if (nodePath.parentPath.isVariableDeclarator()) {
    return !isDeclaredVariableUsedInCallback(nodePath);
  }

  // otherCall(pureCall())
  if (nodePath.parentPath.isCallExpression()) {
    return containsNodePath(
      nodePath.parentPath.get("arguments") || ([] as NodePath[]),
      nodePath,
    );
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
