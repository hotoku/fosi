import fs from "fs";
import { expect } from "chai";
import { JSDOM } from "jsdom";

import {
  convertFile,
  convertString,
  convertMermaidTag,
  createElement,
} from "../src/convert";

describe("convert markdown to html", () => {
  it("should make output file", () => {
    const timestamp = Date.now();
    const contents = `# title
## header

sentece
`;
    const srcPath = `/tmp/input-${timestamp}.md`;
    fs.writeFileSync(srcPath, contents);
    const destPath = `/tmp/output-${timestamp}.html`;

    convertFile(srcPath, destPath);
    expect(fs.existsSync(destPath)).to.be.true;
  });
});

describe("convert markdown string to html string", () => {
  it("should convert markdwon to html", () => {
    const markdown = `# title
## header

sentence
`;
    const converted = convertString(markdown);
    const doc = new JSDOM(converted);
    const h1 = doc.window.document.querySelectorAll("h1");
    expect(h1.length).to.be.equal(1);
  });
});

describe("create element from string", () => {
  it("should generate node object", () => {
    const graph = `
flowchart TD
  a --> b
`.trim();

    const node = createElement(`
<div class="mermaid">
${graph}
</div>
`);
    expect(typeof node.textContent).to.be.equal("string");
    expect((node.textContent as string).trim()).to.be.equal(graph);
  });
});

describe("convert mermaid tag", () => {
  it("should replace pre tag to div tag", () => {
    const graph1 = `
flowchart TD
  a --> b
`.trim();
    const graph2 = `
graph TD
  a --> b
`.trim();
    const html = `
<!DOCTYPE>
<html>
 <body>
  <pre>
   <code class="language-mermaid">
${graph1}
   </code>
  </pre>
  <div>
hoge fuga
  </div>
  <pre>
   <code class="language-mermaid">
${graph2}
   </code>
  </pre>
 </body>
</html>
`;
    const converted = convertMermaidTag(html);
    const dom = new JSDOM(converted);
    const nodes = dom.window.document.querySelectorAll("div.mermaid");
    expect(nodes.length).to.be.equal(2);
    expect((nodes[0].textContent as string).trim()).to.be.equal(graph1);
    expect((nodes[1].textContent as string).trim()).to.be.equal(graph2);
  });
});
