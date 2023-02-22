import KnexStatic, { Knex } from 'knex'

interface WithHasManyRelationOptions {
  as?: string
}

declare module 'knex' {
  namespace Knex {
    interface QueryInterface<TRecord extends {} = any, TResult = any> {
      withHasManyRelation<T extends {}>(
        query: Knex.QueryBuilder<T, any>,
        joinFrom: string,
        joinTo: string,
        options?: WithHasManyRelationOptions,
      ): QueryBuilder<TRecord, TResult & T>
    }
  }
}

KnexStatic.QueryBuilder.extend(
  'withHasManyRelation',
  function withHasManyRelation(
    this,
    relationQuery: Knex.QueryBuilder,
    joinFrom: string,
    joinTo: string,
    options: WithHasManyRelationOptions = {},
  ) {
    // @ts-ignore
    const childTableName = relationQuery._single.table
    return this.then(async (parentRows: any) => {
      const parentIds = parentRows.map((result: any) => result[joinFrom])
      const relations = await relationQuery.whereIn(joinTo, parentIds)
      return parentRows.map((parentRow: any) => {
        parentRow[options.as || childTableName] = relations.filter(
          (relation: any) => {
            if (relation[joinTo] === undefined) {
              throw new Error(
                `knex-with-relations: relation query is missing join column, "${joinTo}". Maybe you forgot to select it?`,
              )
            }
            return relation[joinTo] === parentRow[joinFrom]
          },
        )
        return parentRow
      })
    }) as any
  },
)
