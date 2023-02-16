#!/usr/bin/env node

import parser from "cron-parser";
import pkg from '../package.json' assert {type: 'json'};
import {since} from "../utils.js";
import {cronModuleActions, getModules} from "../index.js";

(async function cma() {
  console.log(`CRON Module Actions v${pkg.version}`);

  if (!process.argv[2]) {
    console.log(`cma <path/to/folder>\n\t path to folder is mandatory!`);
    process.exit(1)
  }

  const start = Date.now();
  const loaded = await getModules(process.argv[2]);

  console.log(`Loaded ${loaded.length} module(s) (${since(start)}ms)`);

  if (process.stdin.isTTY) {
    console.log('-'.repeat(25))
    console.log(`Press [e]xit, [n]ext schedules, [h]elp`);

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (data) => {
      const [key] = [...data];
      if ([3, 24, 101].includes(key)) // CTRL+C, CTRL+X, e
        return process.exit(1);

      if (key === 110) // n
        return (console.log('-'.repeat(25)), loaded.forEach(({name, schedule}) => {
          const next = parser.parseExpression(schedule).next().toISOString();
          const left = (+new Date(next) - Date.now()) / 1000;
          console.log(name, `in ${left}s @`, parser.parseExpression(schedule).next().toDate())
        }))

      console.log('-'.repeat(25))
      console.log(`Press [e]xit, [n]ext schedules`);
    });
  }

  cronModuleActions(loaded);

})();