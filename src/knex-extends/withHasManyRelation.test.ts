import '..'
import { knex, Post, User } from '../test-utils'
import test from 'ava'

test.before(async () => {
  await knex<User>('users').insert([{ id: 1 }, { id: 2 }, { id: 3 }])
  await knex<Post>('posts').insert([
    { id: 1, user_id: 1, title: 'post 1' },
    { id: 2, user_id: 2, title: 'post 2' },
    { id: 3, user_id: 2, title: 'post 3' },
    { id: 4, user_id: 3, title: 'post 4' },
    { id: 5, user_id: 3, title: 'post 5' },
    { id: 6, user_id: 3, title: 'post 6' },
  ])
})

test('check the SQL', async (t) => {
  // @ts-ignore
  knex.on('query', ({ sql }) => t.snapshot(sql))
  await knex<User>('users')
    .where({ id: 1 })
    .withHasManyRelation(knex<Post>('posts'), 'id', 'user_id')
  await knex<User>('users')
    .whereIn('id', [2, 3])
    .withHasManyRelation(knex<Post>('posts'), 'id', 'user_id')
    .then(t.snapshot)
  await knex<User>('users')
    .limit(1)
    .orderBy('id', 'desc')
    .withHasManyRelation(
      knex<Post>('posts').select('id', 'user_id'),
      'id',
      'user_id',
    )
    .then(t.snapshot)
  await knex<Post>('posts')
    .where({ id: 3 })
    .withHasManyRelation(knex<User>('users'), 'user_id', 'id')
    .then(t.snapshot)
})

test('check the value', async (t) => {
  await knex<User>('users')
    .where({ id: 1 })
    .withHasManyRelation(knex<Post>('posts'), 'id', 'user_id')
    .then((res) =>
      t.deepEqual(res, [
        {
          id: 1,
          invited_by: null,
          posts: [
            {
              id: 1,
              title: 'post 1',
              user_id: 1,
            },
          ],
        },
      ]),
    )
  await knex<User>('users')
    .whereIn('id', [2, 3])
    .withHasManyRelation(knex<Post>('posts'), 'id', 'user_id')
    .then((res) =>
      t.deepEqual(res, [
        {
          id: 2,
          invited_by: null,
          posts: [
            { id: 2, user_id: 2, title: 'post 2' },
            { id: 3, user_id: 2, title: 'post 3' },
          ],
        },
        {
          id: 3,
          invited_by: null,
          posts: [
            { id: 4, user_id: 3, title: 'post 4' },
            { id: 5, user_id: 3, title: 'post 5' },
            { id: 6, user_id: 3, title: 'post 6' },
          ],
        },
      ]),
    )
  await knex<User>('users')
    .limit(1)
    .orderBy('id', 'desc')
    .withHasManyRelation(
      knex<Post>('posts').select('user_id', 'title'),
      'id',
      'user_id',
    )
    .then((res) =>
      t.deepEqual(res, [
        {
          id: 3,
          invited_by: null,
          posts: [
            { user_id: 3, title: 'post 4' },
            { user_id: 3, title: 'post 5' },
            { user_id: 3, title: 'post 6' },
          ],
        },
      ]),
    )
  await t.throwsAsync(
    async () => {
      await knex<User>('users').withHasManyRelation(
        knex<Post>('posts').select('title'),
        'id',
        'user_id',
      )
    },
    {
      message: `knex-with-relations: relation query is missing join column, "user_id". Maybe you forgot to select it?`,
    },
  )
  await knex<Post>('posts')
    .where({ id: 3 })
    .withHasManyRelation(knex<User>('users'), 'user_id', 'id')
    .then((res) =>
      t.deepEqual(res, [
        {
          id: 3,
          user_id: 2,
          title: 'post 3',
          users: [{ id: 2, invited_by: null }],
        },
      ]),
    )
  await knex<Post>('posts')
    .where({ id: 3 })
    .withHasManyRelation(knex<User>('users'), 'user_id', 'id', { as: 'user' })
    .then((res) =>
      t.deepEqual(res, [
        {
          id: 3,
          user_id: 2,
          title: 'post 3',
          user: [{ id: 2, invited_by: null }],
        },
      ]),
    )
})

test('check the type', async (t) => {
  function expectType<T>(_expression: T): void {}
  const res = await knex<User>('users')
    .where({ id: 1 })
    .withHasManyRelation(knex<Post>('posts'), 'id', 'user_id')
  expectType<Array<User>>(res) // TODO: we should invent a way to reliably type `Array<(User & { posts: Post[] })>`
  t.pass()
})
