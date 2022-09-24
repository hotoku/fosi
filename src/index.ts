#!/usr/bin/env node

import yargs from "yargs";
import path from "path";
import { launchServers } from "./server";
import { TargetFileExists } from "./exceptions";

const parseArguments = () => {
  const argv = yargs(process.argv.slice(2))
    .options({
      i: { type: "string", describe: "input file", default: "./README.md" },
      d: {
        type: "string",
        describe:
          "output file. if not given, index.html in the same folder as input file.",
      },
      f: { type: "boolean", describe: "overwrite existing output" },
    })
    .parseSync();
  return argv;
};

const main = () => {
  const argv = parseArguments();
  const sourceFile = path.resolve(argv.i);
  try {
    launchServers(sourceFile, { force: argv.f, output: argv.d });
  } catch (e: any) {
    if (e instanceof TargetFileExists) {
      console.log(e.message);
      console.log(
        "If you want to over write the file, start me with -f option."
      );
    }
  }
};

main();
