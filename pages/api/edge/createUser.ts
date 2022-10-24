import { NextRequest, NextResponse } from 'next/server'
import queryBuilder from '../../../db/kysely'

export interface CreateUserInput {
  name: string
}

export interface CreateUsersData {
  success: boolean
}

export default async function handler(req: NextRequest) {
  const { name } = await req.json()

  await queryBuilder.insertInto('Users').values({ name }).execute()

  NextResponse.json({ success: true })
}

export const config = {
  runtime: 'experimental-edge',
}
