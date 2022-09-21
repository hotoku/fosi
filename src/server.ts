import express from "express";
import livereload from "livereload";
import fs from "fs";
import { convertFile } from "./convert";

const publicDir = `${__dirname}/../public`;
const sourceFile = `${__dirname}/../sample.md`;
const destFile = `${publicDir}/index.html`;

fs.watchFile(sourceFile, { persistent: true, interval: 10 }, () => {
  convertFile(sourceFile, destFile);
});

const app = express();
app.use("/", express.static(publicDir));
app.listen(3000);

const server = livereload.createServer();
server.watch(publicDir);
