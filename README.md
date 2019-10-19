![alt Berserk](https://cdn.fusengine.ch/logo/berserk.png "Berserk Engine")

Berserk-engine use [express](https://github.com/expressjs/express) to create simple framework.

## engine()
To use berserk-engine use **`engine()`** which will contain the functions to read the configuration files, routes and your module array customize for your own application.

### Exemple
```js
const berserkEngine = require('@fusengine/berserk-engine')
// or 
const {engine} = require('@fusengine/berserk-engine')

engine(
    // my option
)
```

---
## berserkUtils()
use customized `console.log()`.

`infoMessage('my message' or my var)     Define info messages`<br>
`successMessage('my message' or my var)  Define success messages`<br>
`errorMessage('my message' or my var)    Define error messages`

## Exemple
```js
const berserkEngine = require('@fusengine/berserk-engine')
// or
const {
    infoMessage,
    successMessage,
    errorMessage
    } = require('@fusengine/berserk-engine')

infoMessage(myVar or 'my message')
successMessage(myVar or 'my message')
errorMessage(myVar or 'my message')
```
---
## Exemple

```js
const {engine} = require('@fusengine/berserk-engine')

const myConfig = require('./myConfig')
const myModule1 = require('./myModule')
const myModule2 = require('./myModule')

/** exemple */
engine(
    myConfig,
    'Api',
    'Web',
    [
        myModule1,
        myModule2
    ]
)

engine(configFile, apiFile, webFile, [array require('')] )
```

If you want use [berserk framework](https://github.com/fusengine/berserk).