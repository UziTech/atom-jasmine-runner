# atom-jasmine-runner

```
🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
🚧 Jasmine 2.x test runner for Atom packages.  🚧
🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
```

Very under construction, doesn't really work yet. To use:

`$> npm install atom-jasmine-runner`

```js
// package.json
{
  "atomTestRunner": "./spec/runner.js"
}
```
```js
// ./spec/runner.js
'use babel'
import path from 'path'
import Runner from 'atom-jasmine-runner'
export default Runner(path.join(__dirname, '../'))
```
