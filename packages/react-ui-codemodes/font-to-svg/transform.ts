import * as ts from "typescript";
import { Transformation } from "ts-codemod";

export default class extends Transformation {
  public visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (ts.isJsxSelfClosingElement(node)) {
      console.log(node);
    }

    return node;
  }
}
