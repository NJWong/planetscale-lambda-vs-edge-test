import type { NextApiRequest, NextApiResponse } from 'next'
import queryBuilder from '../../../db/kysely'

export interface CreateUserInput {
  name: string
}

export interface CreateUsersData {
  success: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateUsersData>,
) {
  const { name } = JSON.parse(req.body)

  await queryBuilder.insertInto('Users').values({ name }).execute()

  res.status(200).json({ success: true })
}
