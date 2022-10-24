import { NextRequest, NextResponse } from 'next/server'
import queryBuilder from '../../../db/kysely'

export interface User {
  id: number
  name: string
}

export interface GetUsersData {
  users: User[]
}

export default async function handler(req: NextRequest) {
  const users = await queryBuilder.selectFrom('Users').selectAll().execute()

  return NextResponse.json({
    users,
  })
}

export const config = {
  runtime: 'experimental-edge',
}
