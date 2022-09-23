import { marked } from "marked";
import highlightjs from "highlight.js";
import fs from "fs";
import * as xpath from "xpath-ts";
import { DOMParserImpl } from "xmldom-ts";

export const convertString = (src: string): string => {
  marked.setOptions({
    highlight: function (code, lang) {
      return highlightjs.highlightAuto(code, [lang]).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: true,
    silent: false,
  });

  return marked.parse(src);
};

export const convertFile = (srcPath: string, destPath: string) => {
  const contents = fs.readFileSync(srcPath).toString();
  const ret = convertString(contents);
  fs.writeFileSync(destPath, ret);
};

export const convertMermaidTag = (html: string): string => {
  const parser = new DOMParserImpl();
  const doc = parser.parseFromString(html);
  const nodes = xpath.select(
    "//pre[child::code[contains(@class, 'mermaid')]]",
    doc
  ) as Node[];
  for (const node of nodes) {
    (node.parentNode as ParentNode).replaceChild(
      parser.parseFromString(`<div class='mermaid'>${node.textContent}</div>`),
      node
    );
  }
  return doc.toString();
};
