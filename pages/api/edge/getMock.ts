import { NextRequest, NextResponse } from 'next/server'

export default async function handler(
  req: NextRequest,
) {
  return NextResponse.json({
    data: 'This is some data from edge'
  })
}

export const config = {
  runtime: 'experimental-edge',
};