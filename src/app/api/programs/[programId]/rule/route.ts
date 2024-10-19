// src/app/api/programs/[programId]/rule/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { programId: string } }) {
  try {
    const programId = parseInt(params.programId)

    // Fetch the program along with its assigned rule set
    const program = await prisma.program.findUnique({
      where: { program_id: programId },
      include: {
        rule_set: {
          include: {
            attributes: {
              include: {
                conditions: true,
              },
            },
          },
        },
      },
    })
    if (!program || !program.rule_set) {
      return NextResponse.json({ error: 'No rule set found for this program' }, { status: 404 })
    }

    return NextResponse.json({ ruleSet: program.rule_set })
  } catch (error) {
    console.error('Error fetching rule set:', error)
    return NextResponse.json({ error: 'Failed to fetch rule set' }, { status: 500 })
  }
}
