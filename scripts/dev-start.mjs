import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSubst } from "./ensure-subst.mjs";
import { killAllDevServers } from "./kill-all-dev.mjs";

const PORT = Number(process.env.PORT) || 3456;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");

async function main() {
  const workDir = ensureSubst();
  console.log("\n=== DI darbo gidas — dev serveris ===");
  console.log(`Projektas: ${workDir}`);
  if (workDir !== ROOT) {
    console.log("(junction be apostrofo — Next.js dev reikalauja šio kelio)\n");
  } else {
    console.log();
  }

  await killAllDevServers();

  console.log(`>>> Atidarykite: http://localhost:${PORT} <<<\n`);

  const child = spawn(process.execPath, [NEXT_BIN, "dev", "-p", String(PORT)], {
    stdio: "inherit",
    cwd: workDir,
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}

main();
