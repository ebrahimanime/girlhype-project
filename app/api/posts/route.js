import clientPromise from '../../lib/mongodb'
import { verifyToken } from '../../lib/auth'
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
    const posts = db.collection('posts')

    const allPosts = await posts.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.authorId',
          foreignField: '_id',
          as: 'commentAuthors'
        }
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                content: '$$comment.content',
                createdAt: '$$comment.createdAt',
                author: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$commentAuthors',
                        cond: { $eq: ['$$this._id', '$$comment.authorId'] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          likes: 1,
          comments: 1,
          'author.name': 1,
          'author._id': 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray()

    return NextResponse.json({ posts: allPosts }, { status: 200 })
  } catch (error) {
    console.error('Fetch posts error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
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

    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: 'Post content is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('socialbook')
    const posts = db.collection('posts')

    const newPost = {
      content: content.trim(),
      authorId: new ObjectId(decoded.userId),
      likes: [],
      comments: [],
      createdAt: new Date()
    }

    const result = await posts.insertOne(newPost)
    
    return NextResponse.json(
      { message: 'Post created successfully', postId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}