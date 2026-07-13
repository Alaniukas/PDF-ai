import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DRIVE = "X:";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REAL_ROOT = path.resolve(__dirname, "..");

function getSubstTarget(letter) {
  try {
    const out = execSync("subst", { encoding: "utf8" });
    const prefix = `${letter}\\`.toUpperCase();
    for (const line of out.split(/\r?\n/)) {
      if (!line.toUpperCase().startsWith(prefix)) continue;
      const match = line.match(/=>\s*(.+?)(?:\s*\(|$)/);
      return match?.[1]?.trim() ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Map project to X: on Windows when path contains apostrophe (pdf'ai). */
export function ensureSubst() {
  const normalized = path.resolve(REAL_ROOT);

  if (process.platform !== "win32" || !normalized.includes("'")) {
    return normalized;
  }

  const mapped = getSubstTarget(DRIVE);

  if (mapped && path.resolve(mapped) === normalized) {
    return `${DRIVE}\\`;
  }

  try {
    execSync(`subst ${DRIVE} /D`, { stdio: "ignore" });
  } catch {
    /* ignore */
  }

  execSync(`subst ${DRIVE} "${normalized}"`);
  return `${DRIVE}\\`;
}
