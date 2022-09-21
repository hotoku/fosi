import express from "express";
import livereload from "livereload";
import fs from "fs";
import { convertString } from "./convert";
import ejs from "ejs";

const publicDir = `${__dirname}/../public`;
const sourceFile = `${__dirname}/../sample.md`;
const destFile = `${publicDir}/index.html`;
const templateFile = `${__dirname}/../templates/index.ejs.html`;

fs.watchFile(sourceFile, { persistent: true, interval: 10 }, () => {
  const markdown = fs.readFileSync(sourceFile).toString();
  const converted = convertString(markdown);
  const template = fs.readFileSync(templateFile).toString();
  const html = ejs.render(template, { contents: converted });
  console.log(html);
  fs.writeFileSync(destFile, html);
});

const app = express();
app.use("/", express.static(publicDir));
app.listen(3000);

const server = livereload.createServer();
server.watch(publicDir);
