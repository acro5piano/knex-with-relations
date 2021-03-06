# Snapshot report for `src/knex-with-relations.test.ts`

The actual snapshot is saved in `knex-with-relations.test.ts.snap`.

Generated by [AVA](https://avajs.dev).

## knex-with-relations

> Snapshot 1

    'select * from `users` where `id` = ?'

> Snapshot 2

    'select * from `posts` where `user_id` in (?)'

> Snapshot 3

    [
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

> Snapshot 4

    'select * from `users` where `id` in (?, ?)'

> Snapshot 5

    'select * from `posts` where `user_id` in (?, ?)'

> Snapshot 6

    [
      {
        id: 2,
        posts: [
          {
            id: 2,
            title: 'post 2',
            user_id: 2,
          },
          {
            id: 3,
            title: 'post 3',
            user_id: 2,
          },
        ],
      },
      {
        id: 3,
        posts: [
          {
            id: 4,
            title: 'post 4',
            user_id: 3,
          },
          {
            id: 5,
            title: 'post 5',
            user_id: 3,
          },
          {
            id: 6,
            title: 'post 6',
            user_id: 3,
          },
        ],
      },
    ]

> Snapshot 7

    'select * from `users` order by `id` desc limit ?'

> Snapshot 8

    'select `id`, `user_id` from `posts` where `user_id` in (?)'

> Snapshot 9

    [
      {
        id: 3,
        posts: [
          {
            id: 4,
            user_id: 3,
          },
          {
            id: 5,
            user_id: 3,
          },
          {
            id: 6,
            user_id: 3,
          },
        ],
      },
    ]

> Snapshot 10

    'select * from `posts` where `id` = ?'

> Snapshot 11

    'select * from `users` where `id` in (?)'

> Snapshot 12

    [
      {
        id: 3,
        title: 'post 3',
        user_id: 2,
        users: [
          {
            id: 2,
          },
        ],
      },
    ]
