import express from "express";
import livereload from "livereload";
import fs from "fs";
import { convertMermaidTag, convertString } from "./convert";
import ejs from "ejs";
import path from "path";
import { TargetFileExists } from "./exceptions";

interface IOptions {
  force?: boolean;
  version?: string;
}

export const launchServers = (
  sourceFile: string,
  opts: IOptions = {}
): void => {
  const publicDir = path.dirname(sourceFile);
  const destFile = `${publicDir}/index.html`;
  const version = opts.version || "9.1.6";

  if (fs.existsSync(destFile) && !opts.force) {
    throw new TargetFileExists(destFile);
  }
  const writeHtml = (): void => {
    const markdown = fs.readFileSync(sourceFile).toString();
    const converted = convertString(markdown);
    const templateFile = `${__dirname}/../templates/index.ejs.html`;
    const template = fs.readFileSync(templateFile).toString();
    const html = ejs.render(template, {
      contents: converted,
      mermaid_version: version,
    });
    const replaced = convertMermaidTag(html);
    fs.writeFileSync(destFile, replaced);
  };

  writeHtml();

  fs.watchFile(sourceFile, { persistent: true, interval: 10 }, writeHtml);

  const app = express();
  app.use("/", express.static(publicDir));
  app.listen(3000);

  const server = livereload.createServer();
  server.watch(publicDir);
};
