import {schedule as Schedule} from "node-cron";

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
  const namePattern = ({name, schedule: pattern}) => ({name, pattern,})

  const loaded = [];

  for (const module of modules) {
    try {
      loaded.push(namePattern(module));
      Schedule(module.schedule, module.action);
    } catch (e) {
      console.error(e);
    }
  }

  return loaded;
}