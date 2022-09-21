import express from "express";
import livereload from "livereload";

const public_dir = `${__dirname}/../public`;

const app = express();

app.use("/", express.static(public_dir));

app.listen(3000);

const server = livereload.createServer();
server.watch(public_dir);
