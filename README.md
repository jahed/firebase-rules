# @jahed/firebase-rules

[![Travis](https://img.shields.io/travis/jahed/firebase-rules.svg)](https://travis-ci.org/jahed/firebase-rules)
[![npm](https://img.shields.io/npm/v/@jahed/firebase-rules.svg)](https://www.npmjs.com/package/@jahed/firebase-rules)
[![Patreon](https://img.shields.io/badge/patreon-donate-f96854.svg)](https://www.patreon.com/jahed)
[![Liberapay](https://img.shields.io/badge/liberapay-donate-d9b113.svg)](https://liberapay.com/jahed)

A type-safe Firebase Real-time Database Security Rules builder.

## Installation

```bash
# NPM
npm install --save-dev @jahed/firebase-rules

# Yarn
yarn add --dev @jahed/firebase-rules
```

## Usage

Import the modules you need to build your rules. You can create helper functions
to reduce reptition and give your rules more context. For this example, we'll
just use the modules directly to keep it simple.

```typescript
import { node, props, validate, newData, read, write, equal } from '@jahed/firebase-rules'

const rules = {
  rules: node(props({
    app: node(
      props({
        update: node(props({
          version: node(validate(newData.isString())),
          force: node(validate(newData.isBoolean())),
          timestamp: node(validate(newData.isNumber()))
        })),
        delay: node(validate(newData.isNumber()))
      }),
      read(allowAll),
      write(equal(auth.uid, 'service-admin'))
    ),
    users: node(
      param('$userId', $userId => node(
        props({
          name: node(validate(
            newData.isString(val => between(val.length, 0, 24))
          )),
          created_at: node(validate(allOf(
            newData.isNumber(),
            oneOf(
              not(data.exists()),
              equal(data.val(), newData.val())
            )
          )))
        }),
        write(equal($userId, auth.uid)),
        validate(newData.hasChildren(['name', 'created_at']))
      )),
      read(allowAll)
    )
  }))
}

const json = JSON.stringify(rules, null, 2)
```

Now you can write `json` to a file and push it to Firebase. The configuration
above will look like this in JSON:

```json
{
  "rules": {
    "app": {
      "update": {
        "version": {
          ".validate": "newData.isString()"
        },
        "force": {
          ".validate": "newData.isBoolean()"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        },
        "$other": {
          ".validate": false
        }
      },
      "delay": {
        ".validate": "newData.isNumber()"
      }
    },
    "users": {
      "$userId": {
        "name": {
          ".validate": "(newData.isString() && ((newData.val().length > 0) && (newData.val().length < 24)))"
        },
        "created_at": {
          ".validate": "(newData.isNumber() && (!data.exists() || (data.val() === newData.val())))"
        },
        "$other": {
          ".validate": false
        },
        ".write": "($userId === auth.uid)",
        ".validate": "newData.hasChildren([\"name\",\"created_at\"])"
      },
      ".read": true
    }
  }
}
```

For more thorough examples, see [the tests](tests/database.rules.ts).

## API

For complete API documentation, [see the documentation website](https://jahed.github.io/firebase-rules/).

## License

[MIT](LICENSE)
