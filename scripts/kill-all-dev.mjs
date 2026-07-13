import { execSync } from "node:child_process";

const PORTS = [3456, ...Array.from({ length: 11 }, (_, i) => 3000 + i)];

function killViaPowerShell() {
  for (const port of PORTS) {
    try {
      execSync(
        `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`,
        { stdio: "ignore" }
      );
    } catch {
      /* port may be free */
    }
  }
}

function getPidsOnPort(port) {
  try {
    const out = execSync(`netstat -aon | findstr ":${port} " | findstr LISTENING`, {
      encoding: "utf8",
    });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const pid = Number(line.trim().split(/\s+/).pop());
      if (Number.isFinite(pid)) pids.add(pid);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function killAllDevServers() {
  console.log("Stabdomi dev serveriai (portai 3000-3010, 3456)...");

  killViaPowerShell();
  await sleep(2000);

  const remaining = [...new Set(PORTS.flatMap(getPidsOnPort))];
  if (remaining.length > 0) {
    console.warn(`DEMESIO: vis dar uzimta PID: ${remaining.join(", ")}`);
    console.warn("Task Manager -> node.exe -> End task");
  } else {
    console.log("Visi dev portai atlaisvinti.");
  }
}

if (process.argv[1]?.endsWith("kill-all-dev.mjs")) {
  killAllDevServers().then(() => process.exit(0));
}
