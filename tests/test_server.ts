import fs from "fs";
import os from "os";
import path from "path";
import http from "http";
import { expect } from "chai";
import { JSDOM } from "jsdom";

import { launchServers, IServers } from "../src/server";

const get = (
  url: string
): Promise<{ status: number; body: string }> =>
  new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c as Buffer));
        res.on("end", () =>
          resolve({
            status: res.statusCode as number,
            body: Buffer.concat(chunks).toString(),
          })
        );
      })
      .on("error", reject);
  });

const markdown = `# title

sentence
`;

describe("serving the output file", () => {
  let workDir: string;
  let sourceFile: string;
  let servers: IServers | undefined;

  const launch = async (output?: string): Promise<IServers> => {
    servers = await launchServers(sourceFile, {
      force: true,
      output: output,
      htmlPort: 4100,
      jsPort: 35800,
    });
    return servers;
  };

  const root = (s: IServers): string => `http://localhost:${s.htmlPort}/`;

  beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fosi-test-"));
    fs.mkdirSync(path.join(workDir, "docs"));
    fs.mkdirSync(path.join(workDir, "elsewhere"));
    sourceFile = path.join(workDir, "docs", "doc.md");
    fs.writeFileSync(sourceFile, markdown);
    fs.writeFileSync(path.join(workDir, "docs", "asset.txt"), "an asset");
  });

  afterEach(async () => {
    if (servers) {
      await servers.close();
      servers = undefined;
    }
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  it("should serve the default output at the root", async () => {
    const s = await launch();
    expect(s.destFile).to.be.equal(path.join(workDir, "docs", "index.html"));

    const res = await get(root(s));
    expect(res.status).to.be.equal(200);
    const doc = new JSDOM(res.body).window.document;
    expect(doc.querySelectorAll("h1").length).to.be.equal(1);
  });

  it("should serve the output at the root when -d renames it", async () => {
    const output = path.join(workDir, "docs", "out.html");
    const s = await launch(output);

    const res = await get(root(s));
    expect(res.status).to.be.equal(200);
    expect(new JSDOM(res.body).window.document.querySelectorAll("h1").length)
      .to.be.equal(1);
  });

  it("should serve the output at the root when -d puts it in another folder", async () => {
    const output = path.join(workDir, "elsewhere", "out.html");
    const s = await launch(output);
    expect(fs.existsSync(output)).to.be.true;

    const res = await get(root(s));
    expect(res.status).to.be.equal(200);
    expect(new JSDOM(res.body).window.document.querySelectorAll("h1").length)
      .to.be.equal(1);
  });

  it("should serve the output by its own name when -d puts it in another folder", async () => {
    const output = path.join(workDir, "elsewhere", "out.html");
    const s = await launch(output);

    const res = await get(`${root(s)}out.html`);
    expect(res.status).to.be.equal(200);
  });

  it("should keep serving assets next to the source when -d points elsewhere", async () => {
    const output = path.join(workDir, "elsewhere", "out.html");
    const s = await launch(output);

    const res = await get(`${root(s)}asset.txt`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.equal("an asset");
  });

  it("should resolve a relative output path and create missing folders", async () => {
    const relative = path.join(
      path.relative(process.cwd(), workDir),
      "nested",
      "out.html"
    );
    const s = await launch(relative);

    expect(path.isAbsolute(s.destFile)).to.be.true;
    expect(s.destFile).to.be.equal(path.join(workDir, "nested", "out.html"));
    expect(fs.existsSync(s.destFile)).to.be.true;

    const res = await get(root(s));
    expect(res.status).to.be.equal(200);
  });
});
