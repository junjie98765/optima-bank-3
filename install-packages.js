// This is a helper script to install the required packages
// Run this with: node install-packages.js

const { execSync } = require("child_process")

console.log("Installing required packages...")

try {
  // Install jspdf and jspdf-autotable with legacy-peer-deps flag
  execSync("npm install jspdf jspdf-autotable --legacy-peer-deps", { stdio: "inherit" })
  console.log("Packages installed successfully!")
} catch (error) {
  console.error("Error installing packages:", error.message)
  process.exit(1)
}
