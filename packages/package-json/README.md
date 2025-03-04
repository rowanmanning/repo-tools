
# @rowanmanning/package-json

Load and parse `package.json` and `package-lock.json` files.

* [Requirements](#requirements)
* [Usage](#usage)
  * [`packageJson.fromDirectory()`](#packagejsonfromdirectory)
  * [`packageJson.fromFile()`](#packagejsonfromfile)
  * [`packageJson.fromString()`](#packagejsonfromstring)
  * [`packageJson.fromObject()`](#packagejsonfromobject)
  * [`packageLock.fromDirectory()`](#packagelockfromdirectory)
  * [`packageLock.fromFile()`](#packagelockfromfile)
  * [`packageLock.fromString()`](#packagelockfromstring)
  * [`packageLock.fromObject()`](#packagelockfromobject)
* [Contributing](#contributing)
* [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 20+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/package-json
```

Load into your code with `import` or `require`:

```js
import { packageJson, packageLock } from '@rowanmanning/package-json';
// or
const { packageJson, packageLock } = require('@rowanmanning/package-json');
```

The following exports are available.

### `packageJson.fromDirectory()`

Load the `package.json` file present in a given directory.

```ts
(path: string) => Promise<PackageJson>
```

The `path` argument is required and must be an accessible folder that contains a `package.json` file.

```js
const pkg = await packageJson.fromDirectory('/path/to/my/repo');
// { name: 'my-package', version: '1.0.0', ... }
```

### `packageJson.fromFile()`

Load the `package.json` file at a given file path.

```ts
(path: string) => Promise<PackageJson>
```

The `path` argument is required and must be an accessible JSON file.

```js
const pkg = await packageJson.fromFile('/path/to/my/repo/package.json');
// { name: 'my-package', version: '1.0.0', ... }
```

### `packageJson.fromString()`

Parse a JSON string as a `package.json` file.

```ts
(jsonString: string) => PackageJson
```

The `jsonString` argument is required and must be valid JSON.

```js
const pkg = await packageJson.fromString('{"name": "my-package", "version": "1.0.0"}');
// { name: 'my-package', version: '1.0.0' }
```

### `packageJson.fromObject()`

Verify whether a JavaScript object meets the basic standards for a `package.json` file (e.g. has a `name` and `version` property).

```ts
(object: any) => PackageJson
```

The `jsonString` argument is required and must be valid JSON.

```js
const pkg = await packageJson.fromObject({
    name: 'my-package',
    version: '1.0.0'
});
// { name: 'my-package', version: '1.0.0' }

const pkg = await packageJson.fromObject({});
// Throws an error
```

### `packageLock.fromDirectory()`

Load the `package-lock.json` file present in a given directory.

```ts
(path: string) => Promise<PackageLock>
```

The `path` argument is required and must be an accessible folder that contains a `package-lock.json` file.

```js
const pkg = await packageLock.fromDirectory('/path/to/my/repo');
// { lockfileVersion: 3, name: 'my-package', version: '1.0.0', ... }
```

### `packageLock.fromFile()`

Load the `package-lock.json` file at a given file path.

```ts
(path: string) => Promise<PackageLock>
```

The `path` argument is required and must be an accessible JSON file.

```js
const pkg = await packageLock.fromFile('/path/to/my/repo/package-lock.json');
// { lockfileVersion: 3, name: 'my-package', version: '1.0.0', ... }
```

### `packageLock.fromString()`

Parse a JSON string as a `package-lock.json` file.

```ts
(jsonString: string) => PackageLock
```

The `jsonString` argument is required and must be valid JSON.

```js
const pkg = await packageLock.fromString('{"lockfileVersion": 3, "name": "my-package", "version": "1.0.0"}');
// { lockfileVersion: 3, name: 'my-package', version: '1.0.0' }
```

### `packageLock.fromObject()`

Verify whether a JavaScript object meets the basic standards for a `package-lock.json` file (e.g. has a valid `lockfileVersion`, `name` and `version` property).

```ts
(object: any) => PackageLock
```

The `jsonString` argument is required and must be valid JSON.

```js
const pkg = await packageLock.fromObject({
    lockfileVersion: 3,
    name: 'my-package',
    version: '1.0.0'
});
// { lockfileVersion: 3, name: 'my-package', version: '1.0.0' }

const pkg = await packageLock.fromObject({});
// Throws an error
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/repo-tools#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/repo-tools/blob/main/LICENSE) license.<br/>
Copyright &copy; 2024, Rowan Manning
