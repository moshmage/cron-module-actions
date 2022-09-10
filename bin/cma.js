#!/usr/bin/env node

import parser from "cron-parser";
import pkg from '../package.json' assert {type: "json"};
import {readdirSync} from "fs";
import {resolve} from "path";
import {platform} from "os";
import {since} from "../utils.js";
import {cronModuleActions} from "../index.js";

(async function cma() {
  console.log(`CRON Module Actions v${pkg.version}`);

  if (!process.argv[2]) {
    console.log(`cma <path/to/folder>\n\t path to folder is mandatory!`);
    process.exit(1)
  }

  const loaded = [];
  const start = Date.now();
  const modulePath = process.argv[2];
  const contents = readdirSync(modulePath);
  const modules = contents.filter(file => file.match(/\.m?js$/g));

  console.log(`Found ${modules.length} module(s)`)

  for (const module of modules) {
    const past = +new Date();
    try {
      const filePath = resolve(modulePath, module);
      const {name, description = "", schedule, action, author = ""} = await import((platform() === "win32" && 'file://' || '') + filePath);
      console.log(`${name} (${module} ${since(past)}ms)\n\t${schedule}\t${description}\t${author}`);
      loaded.push({name, schedule, action});
    } catch (e) {
      console.error(e);
    }
  }

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
        return loaded.forEach(({name, schedule}) => {
          const next = parser.parseExpression(schedule).next().toISOString();
          const left = (+new Date(next) - Date.now()) / 1000;
          console.log(name, `in ${left}s @`, parser.parseExpression(schedule).next().toDate())
        })

      console.log('-'.repeat(25))
      console.log(`Press [e]xit, [n]ext schedules`);
    });
  }

  cronModuleActions(loaded);

})();