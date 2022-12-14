import './knex-with-relations'
import createKnex from 'knex'
import test from 'ava'

const knex = createKnex({
  client: 'sqlite3',
  connection: ':memory:',
})

interface User {
  id: number
}

interface Post {
  id: number
  userId: number
  title: string
}

test('knex-with-relations', async (t) => {
  await knex.schema.createTable('users', (t) => {
    t.increments()
  })
  await knex.schema.createTable('posts', (t) => {
    t.increments()
    t.string('title').notNullable()
    t.integer('user_id').notNullable().references('users.id')
  })

  await knex('users').insert([{ id: 1 }, { id: 2 }, { id: 3 }])

  await knex('posts').insert([
    { id: 1, user_id: 1, title: 'post 1' },
    { id: 2, user_id: 2, title: 'post 2' },
    { id: 3, user_id: 2, title: 'post 3' },
    { id: 4, user_id: 3, title: 'post 4' },
    { id: 5, user_id: 3, title: 'post 5' },
    { id: 6, user_id: 3, title: 'post 6' },
  ])

  // @ts-ignore
  knex.on('query', ({ sql }) => t.snapshot(sql))

  const res = await knex<User>('users')
    .where({ id: 1 })
    .withRelations(knex<Post>('posts'), 'id', 'user_id')
    .then((res) => {
      t.snapshot(res)
      return res
    })
  t.true(Array.isArray(res))

  await knex<User>('users')
    .whereIn('id', [2, 3])
    .withRelations(knex<Post>('posts'), 'id', 'user_id')
    .then(t.snapshot)

  await knex<User>('users')
    .limit(1)
    .orderBy('id', 'desc')
    .withRelations(knex<Post>('posts').select('id', 'user_id'), 'id', 'user_id')
    .then(t.snapshot)

  await knex<Post>('posts')
    .where({ id: 3 })
    .withRelations(knex<User>('users'), 'user_id', 'id')
    .then(t.snapshot)
})
