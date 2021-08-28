import './knex-with-relations'
import createKnex from 'knex'
import test from 'ava'

const knex = createKnex({
  client: 'sqlite3',
  connection: ':memory:',
})

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

  await knex('users')
    .where({ id: 1 })
    .withRelations(knex('posts'), 'id', 'user_id')
    .then(t.snapshot)

  await knex('users')
    .whereIn('id', [2, 3])
    .withRelations(knex('posts'), 'id', 'user_id')
    .then(t.snapshot)

  await knex('users')
    .limit(1)
    .orderBy('id', 'desc')
    .withRelations(knex('posts').select('id', 'user_id'), 'id', 'user_id')
    .then(t.snapshot)

  await knex('posts')
    .where({ id: 3 })
    .withRelations(knex('users'), 'user_id', 'id')
    .then(t.snapshot)
})
