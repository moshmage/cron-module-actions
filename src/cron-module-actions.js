import {readdirSync} from 'fs';
import {resolve} from 'path';
import {platform} from 'os';
import {schedule as Schedule} from 'node-cron';
import {msSince} from "../utils/ms-since.js";

export async function cronModuleActions(modulePath = "") {
  const start = +new Date();
  const contents = readdirSync(modulePath);
  const modules = contents.filter(file => file.match(/\.m?js$/g));

  const loaded = [];

  console.log(`Found ${modules.length} module(s)`)

  for (const module of modules) {
    const past = +new Date();
    try {
      const filePath = resolve(modulePath, module);
      const {name, description, schedule, action, author = ""} = await import((platform() === "win32" && 'file://' || '') + filePath);
      console.log(`${name} (${module} ${msSince(past)}ms)\n\t${schedule}\t${description}\t${author}`);
      loaded.push({name, schedule: Schedule(schedule, action), pattern: schedule});
    } catch (e) {
      console.log(`-`.repeat(20));
      console.log(`Error loading ${module} ${msSince(past)}ms)`);
      console.error(e);
      console.log(`-`.repeat(20));
    }
  }

  console.log(`Loaded ${loaded.length} module(s) (${msSince(start)}ms)`);

  return loaded;
}