// src/app/api/rules/[ruleId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { ruleId: string } }) {
  try {
    const ruleId = parseInt(params.ruleId)

    const ruleSet = await prisma.admission_Rule.findUnique({
      where: { rule_set_id: ruleId },
      include: {
        attributes: {
          include: {
            conditions: true,
          },
        },
        weight_ranges: true,
      },
    })

    if (!ruleSet) {
      return NextResponse.json({ error: 'Rule set not found' }, { status: 404 })
    }

    return NextResponse.json({ ruleSet })
  } catch (error) {
    console.error('Error fetching rule set:', error)
    return NextResponse.json({ error: 'Failed to fetch rule set' }, { status: 500 })
  }
}
