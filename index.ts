#!/usr/bin/env node

import { CellTypes } from "./src/game/engine/Engine";

// Main execution
if (require.main === module) {
  console.log("Hello, Space Snake AI! " + CellTypes.SNAKE);
} else {
  console.log("Hello, Space Snake AI! This is a module import.");
}
