const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "contracts", "out");
const destDir = path.join(__dirname, "..", "src", "artifacts", "contracts" );

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = [
  { src: "CosmoShips.sol/CosmoShips.json", dest: "LocalCosmoShips.json" },
  { src: "GameLeague.sol/GameLeague.json", dest: "LocalGameLeague.json" },
];

filesToCopy.forEach((file) => {
  const sourcePath = path.join(sourceDir, file.src);
  const destPath = path.join(destDir, file.dest);

  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file.src} to ${destPath}`);
  } catch (err) {
    console.error(`Error copying ${file.src}:`, err);
  }
});

console.log("Contract ABIs copied successfully.");
