// src/app/api/signin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Ensure UMBC domain email
    if (!email.endsWith('@umbc.edu')) {
      return NextResponse.json({ error: 'Only UMBC domain emails are allowed' }, { status: 403 })
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )

    // Return token and success message
    return NextResponse.json({ token, message: 'Login successful' }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong during login' }, { status: 500 })
  }
}
