/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/rules/create.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, programId, attributes, weightRanges } = await req.json()

    // Validate input
    if (!name || !programId || !attributes || !weightRanges) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Create the rule set with attributes and weight ranges
    const ruleSet = await prisma.admission_Rule.create({
      data: {
        name,
        programs: {
          connect: { program_id: parseInt(programId) }
        },
        attributes: {
          create: attributes.map((attr: any) => ({
            name: attr.name,
            required: attr.required,
            display_order: attr.displayOrder,
            conditions: {
              create: attr.conditions.map((cond: any) => ({
                operator: cond.comparison,
                value: cond.value,
                weight: cond.weight
              }))
            }
          }))
        },
        weight_ranges: {
          create: weightRanges.map((range: any) => ({
            min_weight: range.minWeight,
            max_weight: range.maxWeight,
            admission_chance: range.admissionChance
          }))
        }
      }
    })

    return NextResponse.json({ message: 'Rule set created successfully', ruleSet }, { status: 201 })

  } catch (error) {
    console.error('Error creating rule set:', error)
    return NextResponse.json({ error: 'Failed to create rule set' }, { status: 500 })
  }
}
