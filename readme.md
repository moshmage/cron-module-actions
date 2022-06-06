# Cron Module Actions
A cron helper that imports a given folder

```shell
$ npm install -g cron-module-actions
```

## Usage

### Create a simple module
Modules are javascript files that export `name`, `description`, `schedule`, `author` and `action` properties.
All should be strings, except `action` that should be a `void` function.

`schedule` prop **must** be a valid cron time format.

```js
export const name = "Name";
export const description = "Description";
export const schedule = "1 * * * * *";
export const author = "moshmage@gmail.com"

export function action() {
  console.log(`Hello!`, new Date());
}
```

### Point the cli to the folder
```shell
$ cma ./path/to/folder/with/modules
```

