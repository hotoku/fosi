import fs from "fs";
import { expect } from "chai";
import { DOMParserImpl as dom } from "xmldom-ts";
import * as xpath from "xpath-ts";

import { convertFile, convertString, convertMermaidTag } from "../src/convert";

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
    const doc = new dom().parseFromString(converted);
    const h1 = xpath.select("//h1", doc) as Node[];
    expect(h1.length).to.be.equal(1);
  });
});

describe("convert mermaid tag", () => {
  it("should be replaced with div tag", () => {
    const orig = `
<body>
 <pre>
   <code class="language-mermaid">
flowchart TD
    a
    b
    c
    a --> b
   </code>
 </pre>
</body>`.trim();
    const replaced = convertMermaidTag(orig);
    const doc = new dom().parseFromString(replaced);
    const elms = xpath.select(
      "/body/div[contains(@class, 'mermaid')]",
      doc
    ) as Node[];
    expect(elms.length).to.be.equal(1);
    const cont = (elms[0].textContent || "").trim();
    expect(cont).to.be.equal(
      `
flowchart TD
    a
    b
    c
    a --> b
`.trim()
    );
  });
});
