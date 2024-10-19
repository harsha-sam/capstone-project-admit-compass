// src/app/api/programs/[programId]/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { programId: string } }) {
  try {
    const { formValues } = await req.json()
    const programId = parseInt(params.programId)

    // Fetch the rule set for the program
    const ruleSet = await prisma.admission_Rule.findFirst({
      where: { program_id: programId },
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
      return NextResponse.json({ error: 'No rule set found for this program' }, { status: 404 })
    }

    let totalWeight = 0

    // Calculate total weight based on student's entered values
    ruleSet.attributes.forEach(attr => {
      const studentValue = formValues[attr.name]

      const matchingCondition = attr.conditions.find(cond => {
        switch (cond.operator) {
          case 'GREATER_THAN_OR_EQUAL':
            return studentValue >= cond.value
          case 'GREATER_THAN':
            return studentValue > cond.value
          case 'LESS_THAN_OR_EQUAL':
            return studentValue <= cond.value
          case 'LESS_THAN':
            return studentValue < cond.value
          case 'EQUAL':
            return studentValue === cond.value
          default:
            return false
        }
      })

      if (matchingCondition) {
        totalWeight += matchingCondition.weight
      }
    })

    // Determine the admission chance based on the weight ranges
    const weightRange = ruleSet.weight_ranges.find(range => totalWeight >= range.min_weight && totalWeight <= range.max_weight)

    const admissionChance = weightRange ? weightRange.admission_chance : 0

    return NextResponse.json({
      result: admissionChance,
      message: `Based on the rule set, your total weight is ${totalWeight}. Your admission chance is calculated as ${admissionChance}%.`
    })
  } catch (error) {
    console.error('Error calculating admission:', error)
    return NextResponse.json({ error: 'Failed to calculate admission' }, { status: 500 })
  }
}
