import createKnex from 'knex'
import test from 'ava'

export const knex = createKnex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
})

if (process.env.DEBUG) {
  // @ts-ignore
  knex.on('query', ({ sql }) => console.log(`SQL: ${sql}`))
}

export interface User {
  id: number
  invited_by: number | null
}

export interface Post {
  id: number
  user_id: number
  title: string
}

test.before(async () => {
  await knex.schema.createTable('users', (t) => {
    t.increments()
    t.integer('invited_by')
  })
  await knex.schema.createTable('posts', (t) => {
    t.increments()
    t.string('title').notNullable()
    t.integer('user_id').notNullable().references('users.id')
  })
})
