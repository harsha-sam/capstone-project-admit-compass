// src/app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json()

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 })
    }

    // Ensure only UMBC domain emails are allowed
    if (!email.endsWith('@umbc.edu')) {
      return NextResponse.json({ error: 'Only UMBC domain emails are allowed' }, { status: 403 })
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user with a valid role (either Director or Coordinator)
    await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        role: role === 'Director' ? 'Director' : 'Coordinator',
      },
    })

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong during signup' }, { status: 500 })
  }
}
