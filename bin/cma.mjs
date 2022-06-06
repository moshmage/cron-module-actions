import parser from "cron-parser";
import {cronModuleActions} from "../src/cron-module-actions.js";
import pkg from '../package.json' assert {type: "json"};

function kd(key, description) { return {key, description}; }

(function cma() {
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
      process.exit(1);

    if (key === 104) // h
      console.table([
        kd('h', 'help'),
        kd('s', 'list next schedule dates'),
        kd('e', 'exit')
      ]);

    if (key === 115) // s
      actions.forEach(({name, pattern}) => {
        console.log(name, `next @`, parser.parseExpression(pattern).next().toDate())
      })

    // console.log(key);

  });



  const folderPath = process.argv[2];
  cronModuleActions(folderPath)
    .then(loaded => {
      actions = loaded
      console.log('-'.repeat(25))
      console.log(`Press [e]xit, [s]chedules, [h]elp`);
    });

})();