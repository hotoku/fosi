import { expect } from "chai";
import { parse, NodeType } from "node-html-parser";

describe("parser test", () => {
  it("should work", () => {
    const element = parse(
      `
<!DOCTYPE html>
<html>
 <body>
  <pre>
  </pre>
 </body>
</html>
`.trim()
    );
    expect(element.childNodes.length).to.be.equal(2);
    const html = element.childNodes[1];
    switch (html.nodeType) {
      case NodeType.ELEMENT_NODE:
        break;
      default:
        throw "panic";
    }
  });
});
