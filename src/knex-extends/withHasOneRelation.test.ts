import '..'
import { knex, User } from '../test-utils'
import test from 'ava'

test.before(async () => {
  await knex<User>('users').insert([
    { id: 1, invited_by: null },
    { id: 2, invited_by: 1 },
  ])
  await knex('posts').insert([
    { id: 1, user_id: 1, title: 'post 1' },
    { id: 2, user_id: 2, title: 'post 2' },
    { id: 3, user_id: 2, title: 'post 3' },
  ])
})

test('check the SQL', async (t) => {
  // @ts-ignore
  knex.on('query', ({ sql }) => t.snapshot(sql))
  await knex<User>('users')
    .where({ id: 1 })
    .withHasOneRelation(knex<User>('users'), 'id', 'invited_by')
})

test('check the value', async (t) => {
  await knex<User>('users')
    .where({ id: 1 })
    .withHasOneRelation(knex<User>('users'), 'id', 'invited_by')
    .then((res) =>
      t.deepEqual(res, [
        {
          id: 1,
          invited_by: null,
          users: {
            id: 2,
            invited_by: 1,
          },
        },
      ]),
    )
  await knex<User>('users')
    .where({ id: 1 })
    .withHasOneRelation(knex<User>('users'), 'id', 'invited_by', {
      as: 'inviter',
    })
    .then((res) =>
      t.deepEqual(res, [
        {
          id: 1,
          invited_by: null,
          inviter: {
            id: 2,
            invited_by: 1,
          },
        },
      ]),
    )
})
