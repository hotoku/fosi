import { marked } from "marked";
import highlightjs from "highlight.js";
import fs from "fs";

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
