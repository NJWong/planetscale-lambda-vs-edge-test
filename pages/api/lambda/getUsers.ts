import type { NextApiRequest, NextApiResponse } from 'next'
import { queryBuilder } from '../../../db/kysely'

export interface User {
  id: number
  name: string
}

export interface GetUsersData {
  users: User[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUsersData>
) {
  const users = await queryBuilder.selectFrom('Users').selectAll().execute()
  res.status(200).json({ users })
}
