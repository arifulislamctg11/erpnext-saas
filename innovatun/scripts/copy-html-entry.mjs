import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const src = resolve(__dirname, "../../erpnext_saas/public/innovatun/index.html");
  const dstDir = resolve(__dirname, "../../erpnext_saas/www");
  const dst = resolve(dstDir, "innovatun.html");

  await fs.mkdir(dstDir, { recursive: true });
  await fs.copyFile(src, dst);
  console.log(`Copied ${src} -> ${dst}`);
}

main().catch((err) => {
  console.error("copy-html-entry failed:", err);
  process.exit(1);
});


