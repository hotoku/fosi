import yargs from "yargs";
import path from "path";
import { launchServers } from "./server";

const parseArguments = () => {
  const argv = yargs(process.argv.slice(2))
    .options({
      i: { type: "string", demandOption: true, describe: "input file" },
      d: { type: "string", describe: "output file", default: "./index.html" },
      f: { type: "boolean", describe: "overwrite existing output" },
    })
    .parseSync();
  return argv;
};

const main = () => {
  const argv = parseArguments();
  const sourceFile = path.resolve(argv.i);
  launchServers(sourceFile, { force: argv.f });
};

main();
