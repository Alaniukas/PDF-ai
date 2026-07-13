import { spawnSync } from "node:child_process";
import { ensureSubst } from "./ensure-subst.mjs";

const workDir = ensureSubst();
console.log(`Build from: ${workDir}\n`);

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  cwd: workDir,
});

process.exit(result.status ?? 1);
