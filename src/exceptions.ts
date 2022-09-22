import fs from "fs";

export class FileNotFound extends Error {
  constructor(path: fs.PathLike) {
    super(`${path} does not exists.`);
  }
}

export class PathIsDirectory extends Error {
  constructor(path: fs.PathLike) {
    super(`${path} is a directory.`);
  }
}

export class TargetFileExists extends Error {
  constructor(path: fs.PathLike) {
    super(`${path} already exists.`);
  }
}
