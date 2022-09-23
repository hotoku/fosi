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

/*
export const convertMermaidTag = (html: string): string => {
  const dom = new JSDOM(html);
  const nodes = dom.window.document.querySelectorAll("code.language-mermaid");
  for (const node of nodes) {
    // (node.parentNode as ParentNode).replaceChild();
  }
  const ret = doc.toString();
  if (is_replaced) {
    return addDoctype(ret);
  } else {
    return ret;
  }
};
*/
