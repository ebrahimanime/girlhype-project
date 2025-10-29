import clientPromise from '../../../../lib/mongodb'
import { verifyToken } from '../../../../lib/auth'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
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
    const userId = new ObjectId(decoded.userId)

    const post = await posts.findOne({ _id: new ObjectId(postId) })
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    const hasLiked = post.likes.some(like => like.toString() === userId.toString())

    if (hasLiked) {
      // Unlike the post
      await posts.updateOne(
        { _id: new ObjectId(postId) },
        { $pull: { likes: userId } }
      )
    } else {
      // Like the post
      await posts.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { likes: userId } }
      )
    }

    return NextResponse.json(
      { message: hasLiked ? 'Post unliked' : 'Post liked' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Like/unlike error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}