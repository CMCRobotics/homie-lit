import { serve } from "bun";
import path from "path";

const port = 9000;
const mode = process.argv.includes("--aframe") ? "demo-aframe" : "demo";

serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    if (pathname === "/" || pathname === "") {
      pathname = "/index.html";
    }

    let targetPath: string;
    if (pathname.startsWith("/dist/")) {
      targetPath = path.join(import.meta.dir, "dist", pathname.substring(6));
    } else {
      const pathsToTry = [
        path.join(import.meta.dir, mode, pathname),
        path.join(import.meta.dir, "dist", pathname),
        path.join(import.meta.dir, pathname),
      ];
      
      targetPath = pathsToTry[0];
      for (const p of pathsToTry) {
        if (await Bun.file(p).exists()) {
          targetPath = p;
          break;
        }
      }
    }

    const file = Bun.file(targetPath);
    if (await file.exists()) {
      return new Response(file);
    }

    console.warn(`404: Not Found: ${pathname} (mapped to: ${targetPath})`);
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${port}/ (mode: ${mode})`);
