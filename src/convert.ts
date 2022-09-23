import { marked } from "marked";
import highlightjs from "highlight.js";
import fs from "fs";
import { JSDOM } from "jsdom";

export const createElement = (s: string): Node => {
  const div = new JSDOM().window.document.createElement("div");
  div.innerHTML = s.trim();
  return div.firstChild as ChildNode;
};

export const convertString = (src: string): string => {
  marked.setOptions({
    highlight: function (code, lang) {
      return highlightjs.highlightAuto(code, [lang]).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
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
  const dom = new JSDOM(html);
  const nodes = dom.window.document.querySelectorAll("code.language-mermaid");
  for (const node of nodes) {
    const pre = node.parentNode as ParentNode;
    const parent = pre.parentNode as ParentNode;
    parent.replaceChild(
      createElement(`<div class="mermaid">${node.textContent}</div>`),
      pre
    );
  }
  const ret = dom.serialize();
  return ret;
};
