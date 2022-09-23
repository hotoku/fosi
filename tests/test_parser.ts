import { expect } from "chai";
import { parse } from "node-html-parser";

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
  });
});
