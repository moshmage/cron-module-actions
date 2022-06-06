import parser from "cron-parser";
import {cronModuleActions} from "./cron-module-actions.js";
import pkg from './package.json' assert {type: "json"};

(async function cma() {
  console.log(`CRON Module Actions v${pkg.version}`);

  if (!process.argv[2]) {
    console.log(`cma <path/to/folder>\n\t path to folder is mandatory!`);
    process.exit(1)
  }

  let actions;

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', (data) => {
    const [key] = [...data];
    if ([3, 24, 101].includes(key)) // CTRL+C, CTRL+X, e
      return process.exit(1);

    if (key === 110) // n
      return actions.forEach(({name, pattern}) => {
        console.log(name, `next @`, parser.parseExpression(pattern).next().toDate())
      })

    console.log(`Press [e]xit, [n]ext schedules, [h]elp`);
  });

  actions = await cronModuleActions(process.argv[2])
  console.log('-'.repeat(25))
  console.log(`Press [e]xit, [n]ext schedules, [h]elp`);

})();