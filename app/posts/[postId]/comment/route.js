import clientPromise from '../../../../lib/mongodb'
import { verifyToken } from '../../../../lib/auth'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  try {
    const { postId } = params
    const { content } = await request.json()
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

    if (!ObjectId.isValid(postId)) {
      return NextResponse.json(
        { message: 'Invalid post ID' },
        { status: 400 }
      )
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: 'Comment content is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('socialbook')
    const posts = db.collection('posts')

    const post = await posts.findOne({ _id: new ObjectId(postId) })
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    const comment = {
      content: content.trim(),
      authorId: new ObjectId(decoded.userId),
      createdAt: new Date()
    }

    await posts.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: comment } }
    )

    return NextResponse.json(
      { message: 'Comment added successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}