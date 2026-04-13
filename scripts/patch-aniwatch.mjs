import { readFileSync, writeFileSync } from "fs";

const file = "node_modules/aniwatch/dist/index.js";
let src = readFileSync(file, "utf8");

// Replace the dead MegacloudKeys repo with the working itzzzme/megacloud-keys repo.
// The old repo returned JSON {"mega": "<key>"}, the new one returns a plain-text key,
// so we also patch the key extraction to handle both formats.
src = src.replace(
  `const response = await axios5.get(
        "https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json"
      );
      const key = response.data;
      const megacloudKey = key["mega"];`,
  `const response = await axios5.get(
        "https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/key.txt"
      );
      const key = response.data;
      const megacloudKey = typeof key === "string" ? key.trim() : key["mega"];`,
);

writeFileSync(file, src);
console.log("[patch-aniwatch] Patched MegaCloud keys URL");
