import yargs from "yargs";
import path from "path";
import { launchServers } from "./server";

interface Argv {
  f: string;
}

const parseArguments = (): Argv => {
  const argv = yargs(process.argv.slice(2))
    .options({
      f: { type: "string", demandOption: true },
    })
    .parseSync();
  return argv;
};

const main = () => {
  const argv = parseArguments();
  const sourceFile = path.resolve(argv.f);
  launchServers(sourceFile);
};

main();
