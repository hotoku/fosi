import express from "express";
import livereload from "livereload";
import fs from "fs";
import { convertMermaidTag, convertString } from "./convert";
import ejs from "ejs";
import path from "path";
import { TargetFileExists } from "./exceptions";

interface IOptions {
  force?: boolean;
  mermaid_version?: string;
  htmlPort?: number;
  jsPort?: number;
  output?: string;
}

export const launchServers = (
  sourceFile: string,
  opts: IOptions = {}
): void => {
  const publicDir = path.dirname(sourceFile);
  const destFile = opts.output || `${publicDir}/index.html`;
  const mermaid_version = opts.mermaid_version || "9.1.7";
  const templateDir = `${__dirname}/../templates`;
  const htmlPort = opts.htmlPort || 3000;
  const jsPort = opts.jsPort || 35729;

  console.log(`sourceFile=${sourceFile}
destFile=${destFile}
publicDir=${publicDir}
htmlPort=${htmlPort}
jsPort=${jsPort}`);

  if (fs.existsSync(destFile) && !opts.force) {
    throw new TargetFileExists(destFile);
  }
  const writeHtml = (): void => {
    const markdown = fs.readFileSync(sourceFile).toString();
    const converted = convertString(markdown);
    const templateFile = `${templateDir}/index.ejs.html`;
    const template = fs.readFileSync(templateFile).toString();
    const html = ejs.render(template, {
      contents: converted,
      mermaid_version: mermaid_version,
      js_port: jsPort,
    });
    const replaced = convertMermaidTag(html);
    fs.writeFileSync(destFile, replaced);
  };

  writeHtml();

  fs.watchFile(sourceFile, { persistent: true, interval: 10 }, writeHtml);

  const app = express();
  app.use("/template", express.static(templateDir));
  app.use("/", express.static(publicDir));
  app.listen(htmlPort);

  const server = livereload.createServer({ port: jsPort });
  server.watch(publicDir);

  console.log(`Servers start. Visit http://localhost:${htmlPort}`);
};
