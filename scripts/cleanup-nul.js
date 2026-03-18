/**
 * Windows guard: removes a stray "nul" file that can break Next/Turbopack.
 */
const fs = require("fs");
const path = require("path");

const nulPath = path.join(process.cwd(), "nul");
const nulWinPath = "\\\\?\\" + nulPath;

try {
  if (fs.existsSync(nulWinPath)) {
    fs.unlinkSync(nulWinPath);
    console.log("Removed stray 'nul' file at project root.");
  }
} catch (error) {
  // Best-effort cleanup; ignore if locked or missing.
  console.warn("Could not remove 'nul' file (may be locked):", error.message);
}
