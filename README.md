![alt Berserk](https://cdn.fusengine.ch/logo/berserk.png "Berserk Engine")

Berserk-engine use [express](https://github.com/expressjs/express) to create simple framework.

# Use berserk-engine:
If you want use berserk-engine
```js
const {engine, berserkPath} = require('@fusengine/berserk-engine')

/** exemple */
engine('config','Api', 'Web', berserkPath('src/views'))

engine(configFile, apiFile, webFile, berserkPath(pathToViewFile) )
```