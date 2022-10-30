import KnexStatic, { Knex } from 'knex'

declare module 'knex' {
  namespace Knex {
    interface QueryInterface<TRecord extends {} = any, TResult = any> {
      withRelations<T>(
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
      
      const groupedRelations = relations.reduce((acc: any, curr: any) => {
        const key = curr[joinTo]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(curr)
        return acc
      }, {})

      return rows.map((row: any) => {
        row[joinFrom] = groupedRelations[row[joinFrom]] || []
        return row
      })
    }) as any
  },
)
