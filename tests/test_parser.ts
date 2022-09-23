import { expect } from "chai";
import { JSDOM } from "jsdom";
import { createElement } from "../src/convert";

describe("parser test", () => {
  it("should extract code tag", () => {
    const dom = new JSDOM(
      `
<!DOCTYPE html>
<html>
 <body>
  <pre>
   <code class="language-mermaid">
flowchart TD
  a --> b
   </code>
  </pre>
  <pre>
   <code class="language-mermaid">
graph TD
  a --> b
   </code>
  </pre>
 </body>
</html>
`.trim()
    );
    const codes = dom.window.document.querySelectorAll("code.language-mermaid");
    expect(codes.length).to.be.equal(2);
  });
});
