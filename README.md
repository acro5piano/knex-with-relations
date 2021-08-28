# knex-with-relations

A Knex plugin for batch loading table relations.

# Features

- Includes the TypeScript type definition.
- Works with `select` and `returning`.
- Under 40 LOC

# Install

```sh
yarn add knex-with-relations
```

# Usage

```typescript
import 'knex-with-relations'

import createKnex from 'knex'

export const knex = createKnex(dbConfig)
```

And you are ready to go.

```typescript
knex('users').withRelations(knex('posts'), 'id', 'user_id').then(console.log)

// Result
      {
        id: 1,
        posts: [
          {
            id: 1,
            title: 'post 1',
            user_id: 1,
          },
        ],
      },
    ]
```
