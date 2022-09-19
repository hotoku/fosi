import fs from "fs";
import { expect } from "chai";
import { DOMParserImpl as dom } from "xmldom-ts";
import * as xpath from "xpath-ts";

import { convertFile, convertString } from "../src/convert";

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

  describe("convert markdown string to html string", () => {
    it("should convert markdwon to html", () => {
      const markdown = `# title
## header

sentence
`;
      const converted = convertString(markdown);
      const doc = new dom().parseFromString(converted);
      const h1 = xpath.select("//h1", doc);
      if (typeof h1 === "object") {
        const obj: any = h1;
        expect(obj.length).to.be.equal(1);
      } else {
        throw "panic";
      }
    });
  });
});
