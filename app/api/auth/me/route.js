import clientPromise from '../../../lib/mongodb'
import { verifyToken } from '../../../lib/auth'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db('socialbook')
    const users = db.collection('users')

    const user = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}