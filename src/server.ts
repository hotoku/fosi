import express from "express";
import livereload from "livereload";
import fs from "fs";
import os from "os";
import { convertMermaidTag, convertString } from "./convert";
import ejs from "ejs";
import path from "path";
import { TargetFileExists } from "./exceptions";
import * as portfinder from "portfinder";

interface IOptions {
  force?: boolean;
  mermaid_version?: string;
  htmlPort?: number;
  jsPort?: number;
  output?: string;
}

export interface IServers {
  htmlPort: number;
  jsPort: number;
  sourceFile: string;
  destFile: string;
  publicDir: string;
  /** set only when -d was omitted and the output went to a throwaway folder */
  tempDir?: string;
  close: () => Promise<void>;
}

/**
 * Without -d the output is a byproduct nobody asked to keep, so it goes to a
 * throwaway folder instead of dropping an index.html next to the source.
 */
const resolveDest = (
  output?: string
): { destFile: string; tempDir?: string } => {
  if (output) {
    return { destFile: path.resolve(output) };
  }
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fosi-"));
  return { destFile: path.join(tempDir, "index.html"), tempDir };
};

export const launchServers = async (
  sourceFile: string,
  opts: IOptions = {}
): Promise<IServers> => {
  const publicDir = path.dirname(sourceFile);
  const { destFile, tempDir } = resolveDest(opts.output);
  const destDir = path.dirname(destFile);
  const mermaid_version = opts.mermaid_version || "9.3.0";
  const templateDir = `${__dirname}/../templates`;
  const htmlPort = await portfinder.getPortPromise({
    port: opts.htmlPort || 3000,
  });
  const jsPort = await portfinder.getPortPromise({
    port: opts.jsPort || 35729,
  });

  console.log(`sourceFile=${sourceFile}
destFile=${destFile}
publicDir=${publicDir}
htmlPort=${htmlPort}
jsPort=${jsPort}`);

  const removeTempDir = (): void => {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  };
  const onSignal = (): void => {
    removeTempDir();
    process.exit(0);
  };
  if (tempDir) {
    process.on("exit", removeTempDir);
    process.on("SIGINT", onSignal);
    process.on("SIGTERM", onSignal);
  }

  // a temp destination is freshly made, so only an explicit -d can collide
  if (fs.existsSync(destFile) && !opts.force) {
    removeTempDir();
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
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destFile, replaced);
  };

  writeHtml();

  fs.watchFile(sourceFile, { persistent: true, interval: 10 }, writeHtml);

  const app = express();
  // the output file is what the user came to see, whatever it is named and
  // wherever -d put it, so serve it at the root explicitly.
  app.get("/", (_req, res) => res.sendFile(destFile));
  app.use("/template", express.static(templateDir));
  // publicDir carries the assets the markdown refers to, destDir the output.
  app.use("/", express.static(publicDir));
  if (destDir !== publicDir) {
    app.use("/", express.static(destDir));
  }
  const httpServer = app.listen(htmlPort);

  const server = livereload.createServer({ port: jsPort });
  server.watch(destDir === publicDir ? publicDir : [publicDir, destDir]);

  console.log(`Servers start. Visit http://localhost:${htmlPort}`);

  return {
    htmlPort,
    jsPort,
    sourceFile,
    destFile,
    publicDir,
    tempDir,
    close: async (): Promise<void> => {
      process.removeListener("exit", removeTempDir);
      process.removeListener("SIGINT", onSignal);
      process.removeListener("SIGTERM", onSignal);
      fs.unwatchFile(sourceFile, writeHtml);
      server.close();
      await new Promise<void>((resolve, reject) =>
        httpServer.close((e) => (e ? reject(e) : resolve()))
      );
      removeTempDir();
    },
  };
};
