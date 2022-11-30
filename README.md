# knex-with-relations

A Knex plugin for batch loading table relations.

# Features

- Use `whereIn` clause to filter relations, which should be good for performance in the most of situations
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

# For v0.0.3 users

Please update to the latest version. v0.0.3 does not work well at all.
