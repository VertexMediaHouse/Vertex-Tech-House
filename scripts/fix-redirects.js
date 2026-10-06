import { writeFileSync } from "fs";
import { resolve } from "path";

const redirectsPath = resolve(process.cwd(), "dist", "client", "_redirects");
const content = "/*    /.netlify/functions/index   200\n";

writeFileSync(redirectsPath, content, "utf8");
console.log(`Updated _redirects at ${redirectsPath}`);
