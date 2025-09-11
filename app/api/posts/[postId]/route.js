import clientPromise from '../../../lib/mongodb'
import { verifyToken } from '../../../lib/auth'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const { postId } = params
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

    if (post.authorId.toString() !== decoded.userId) {
      return NextResponse.json(
        { message: 'You can only delete your own posts' },
        { status: 403 }
      )
    }

    await posts.deleteOne({ _id: new ObjectId(postId) })
    
    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}