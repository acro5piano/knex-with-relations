# knex-with-relations

A Knex plugin for batch loading table relations.

# Breaking changes on v2.0.0

`.withRelations` method was changed to `.withHasManyRelation`.

# Features

- Use `whereIn` clause to filter relations, which should be good for performance in the most of situations
- Provides convenient method to fetch both n-1 relation and 1-1 relation
- Plug and play, no special setup required

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

### `.withHasManyRelation`

```typescript
knex('users').withHasManyRelation(knex('posts'), 'id', 'user_id').then(console.log)

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
}
```

### `.withHasOneRelation`

```typescript
knex('users').withHasOneRelation(knex('posts'), 'id', 'user_id').then(console.log)

// Result
{
  id: 1,
  posts: {
      id: 1,
      title: 'post 1',
      user_id: 1,
  },
}
```

### Advanced Usage

You can also specify the attribute name. If not specified, it uses table name.

```typescript
knex('users')
  .where({ id: 1 })
  .withHasOneRelation(
    knex('posts').orderBy('created_at', 'DESC').limit(1),
    'id',
    'user_id',
    { as: 'latest_post' } // <--- This renames the attribute name to `latest_post`. If no provided, it become `posts`.
  )
  .then(console.log)

// Result
{
  id: 1,
  latest_post: [
    {
      id: 1,
      title: 'post 1',
      user_id: 1,
      created_at: 'Wed Feb 22 05:23:47 PM JST 2023',
    },
  ],
}
```

# TODO

- [ ] Stronger TypeScript support. Currently it does not change type definition, meaning that child attributes are ignored. I tried to implement using `infer`, but no luck. If you are enough knowledge to implement it, please send a PR. Thanks.
