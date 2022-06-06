import {cronModuleActions} from "../src/cron-module-actions.js";

(function cma() {
  if (!process.argv[2]) {
    console.log(`cma <path/to/folder>\n\t path to folder is mandatory!`);
    process.exit(1)
  }

  const folderPath = process.argv[2];
  cronModuleActions(folderPath);
})();