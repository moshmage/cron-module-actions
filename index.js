import {schedule as Schedule} from "node-cron";
import {readdirSync} from "fs";
import {resolve} from "path";
import {platform} from "os";
import {since} from "./utils.js";

/**
 * @typedef {Object} CModule
 * @property {string} name name of module
 * @property {string} [description] description of module
 * @property {string} schedule valid crontab
 * @property {string} [author] author of module
 * @property {() => void} action functionality for this module
 */

/**
 * Iterates over modules and instantiates a cron schedule
 * @param {CModule[]} modules
 */
export function cronModuleActions(modules = []) {
  const namePattern = ({name, schedule: pattern}) => ({name, pattern,});
  const taskRunner = (module) => (t) => {
    if (process?.env?.NODE_ENV?.includes('dev'))
      console.log(`Calling ${module.name} task at ${t.toISOString()}`);
    module.action();
  }

  const loaded = [];

  for (const module of modules) {
    try {
      loaded.push(namePattern(module));
      Schedule(module.schedule, taskRunner(module));
    } catch (e) {
      console.error(e);
    }
  }

  return loaded;
}

export async function getModules(modulePath = "", muted = false) {
  const loaded = [];
  const contents = readdirSync(modulePath);
  const modules = contents.filter(file => file.match(/\.m?js$/g));

  if (!muted)
    console.log(`Found ${modules.length} module(s)`)

  for (const module of modules) {
    const past = +new Date();
    try {
      const filePath = resolve(modulePath, module);
      const {name, description = "", schedule, action, author = ""} = await import((platform() === "win32" && 'file://' || '') + filePath);
      if (!muted)
        console.log(`${name} (${module} ${since(past)}ms)\n\t${schedule}\t${description}\t${author}`);
      loaded.push({name, schedule, action});
    } catch (e) {
      console.error(e);
    }
  }

  return loaded;
}