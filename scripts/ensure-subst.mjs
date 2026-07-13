import { execSync } from "node:child_process";
import { existsSync, lstatSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REAL_ROOT = path.resolve(__dirname, "..");

function junctionPathFor(realPath) {
  const parent = path.dirname(realPath);
  const base = path.basename(realPath).replace(/'/g, "-");
  return path.join(parent, base);
}

function isJunction(filePath) {
  try {
    return lstatSync(filePath).isJunction?.() ?? false;
  } catch {
    return false;
  }
}

function junctionPointsTo(junctionPath, targetPath) {
  try {
    return path.resolve(realpathSync(junctionPath)) === path.resolve(targetPath);
  } catch {
    return false;
  }
}

/**
 * On Windows, apostrophes in the project path break Next.js/webpack module resolution.
 * Use a drive junction (e.g. E:\pdf-ai -> E:\pdf'ai) instead of SUBST.
 */
export function ensureSubst() {
  const normalized = path.resolve(REAL_ROOT);

  if (process.platform !== "win32" || !normalized.includes("'")) {
    return normalized;
  }

  const junction = junctionPathFor(normalized);

  if (existsSync(junction)) {
    if (junctionPointsTo(junction, normalized)) {
      return junction;
    }

    if (isJunction(junction)) {
      execSync(`cmd /c rmdir "${junction}"`, { stdio: "ignore" });
    } else {
      throw new Error(
        `Cannot create dev junction: "${junction}" exists and is not a link to this project.`,
      );
    }
  }

  execSync(`cmd /c mklink /J "${junction}" "${normalized}"`, { stdio: "inherit" });
  return junction;
}
