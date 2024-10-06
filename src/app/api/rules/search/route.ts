// src/app/api/rules/search.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url) // Extract query params from the request URL
    const programId = searchParams.get('programId') // Get 'programId' from query params

    let ruleSets;

    // If no programId is provided, return all rule sets
    if (!programId) {
      ruleSets = await prisma.admission_Rule.findMany({
        include: {
          programs: true
        } 
      }) // Fetch all rule sets
    } else {
      // Fetch rule sets associated with the given programId
      ruleSets = await prisma.admission_Rule.findMany({
        where: {
          program: {
            program_id: parseInt(programId)
          }
        },
        include: {
          programs: true
        } 
      })
    }

    return NextResponse.json({ ruleSets }, { status: 200 })

  } catch (error) {
    console.error('Error fetching rule sets:', error)
    return NextResponse.json({ error: 'Failed to fetch rule sets' }, { status: 500 })
  }
}
