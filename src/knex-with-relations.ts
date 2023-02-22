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
    relationQuery: Knex.QueryBuilder,
    joinFrom: string,
    joinTo: string,
  ) {
    // @ts-ignore
    const childTableName = relationQuery._single.table
    return this.then(async (parentRows: any) => {
      const parentIds = parentRows.map((result: any) => result[joinFrom])
      const relations = await relationQuery.whereIn(joinTo, parentIds)
      return parentRows.map((parentRow: any) => {
        parentRow[childTableName] = relations.filter((relation: any) => {
          if (relation[joinTo] === undefined) {
            throw new Error(
              `knex-with-relations: relation query is missing join column, "${joinTo}". Maybe you forgot to select it?`,
            )
          }
          return relation[joinTo] === parentRow[joinFrom]
        })
        return parentRow
      })
    }) as any
  },
)
