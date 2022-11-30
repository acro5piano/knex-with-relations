import KnexStatic, { Knex } from 'knex'

declare module 'knex' {
  namespace Knex {
    interface QueryInterface<TRecord extends {} = any, TResult = any> {
      withRelations<T extends {}>(
        query: Knex.QueryBuilder<T, any>,
        joinFrom: string,
        joinTo: string,
      ): QueryBuilder<TRecord, TResult & T>
    }
  }
}

KnexStatic.QueryBuilder.extend(
  'withRelations',
  function withRelations(
    this,
    query: Knex.QueryBuilder,
    joinFrom: string,
    joinTo: string,
  ) {
    // @ts-ignore
    const childTableName = query._single.table
    return this.then(async (rows: any) => {
      const parentIds = rows.map((result: any) => result[joinFrom])
      const relations = await query.whereIn(joinTo, parentIds)
      return rows.map((row: any) => {
        row[childTableName] = relations.filter(
          (r: any) => r[joinTo] === row[joinFrom],
        )
        return row
      })
    }) as any
  },
)
