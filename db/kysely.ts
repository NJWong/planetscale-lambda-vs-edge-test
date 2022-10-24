import { Generated, Kysely } from 'kysely'
import { PlanetScaleDialect } from 'kysely-planetscale'

interface UserTable {
  id: Generated<number>
  name: string
}

interface Database {
  Users: UserTable
}

console.log('INIT KYSELY')

const queryBuilder = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }),
})

export default queryBuilder
