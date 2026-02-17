import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const srcDir = path.join(root, "public");
const outDir = path.join(process.cwd(), "www");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyDir(src, dst) {
  ensureDir(dst);
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, ent.name);
    const to = path.join(dst, ent.name);
    if (ent.name === ".DS_Store") continue;
    // Avoid copying local thumbnail artifacts.
    if (ent.isFile() && ent.name.endsWith(".svg.png")) continue;
    if (ent.isDirectory()) {
      copyDir(from, to);
    } else if (ent.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

function rmIfExists(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

rmIfExists(outDir);
ensureDir(outDir);
copyDir(srcDir, outDir);

// Inject API base + capacitor.js into HTML so native plugins can be used.
const htmlFiles = ["index.html", "login.html", "share.html"];
for (const f of htmlFiles) {
  const p = path.join(outDir, f);
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, "utf8");
  if (!html.includes("window.__API_BASE_URL") && !html.includes("capacitor.js")) {
    // Set API base for native app. Web build keeps it empty.
    const inject = [
      '<script>',
      '  // Native app: call the live API while loading local assets.',
      '  window.__API_BASE_URL = "https://notematica.com";',
      "</script>",
      '<script src="capacitor.js"></script>'
    ].join("\n");
    html = html.replace("</head>", `${inject}\n</head>`);
  }
  fs.writeFileSync(p, html, "utf8");
}

console.log(`Synced ${srcDir} -> ${outDir}`);
