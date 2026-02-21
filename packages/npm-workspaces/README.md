
# @rowanmanning/npm-workspaces

Get a list of all the npm workspaces found in a `package-lock.json` file.

* [Requirements](#requirements)
* [Usage](#usage)
  * [`getPackageWorkspaces()`](#getpackageworkspaces)
* [Contributing](#contributing)
* [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 22+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/npm-workspaces
```

Load one of the methods into your code with `import` or `require`:

```js
import { getPackageWorkspaces } from '@rowanmanning/npm-workspaces';
// or
const { getPackageWorkspaces } = require('@rowanmanning/npm-workspaces');
```

The following exports are available.

### `getPackageWorkspaces()`

A function to list the npm workspaces that a `package-lock.json` file defines. This function has the following signature:

```ts
(packageLock: PackageLock) => string[]
```

`PackageLock` must be a JavaScript object that is a valid `package-lock.json` or `package-lock.json` file. We recommend using [@rowanmanning/package-json](../package-json#readme) or [@npmcli/package-json](https://github.com/npm/package-json#readme).

```js
const workspaces = getPackageWorkspaces(require('./package-lock.json'));
// ['', 'packages/example-1', 'packages/example-2']
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/repo-tools#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/repo-tools/blob/main/LICENSE) license.<br/>
Copyright &copy; 2024, Rowan Manning
