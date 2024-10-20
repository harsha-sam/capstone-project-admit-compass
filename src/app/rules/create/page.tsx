/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateRuleSet() {
  const router = useRouter()
  const [name, setName] = useState('') // Rule set name
  const [programs, setPrograms] = useState<any>([]) // Programs fetched from the API
  const [selectedProgram, setSelectedProgram] = useState('') // Selected program ID
  const [attributes, setAttributes] = useState<any>([
    {
      name: '',
      required: false,
      displayOrder: 1,
      conditions: [{ comparison: 'GREATER_THAN_OR_EQUAL', value: 0, weight: 0 }]
    }
  ])
  const [weightRanges, setWeightRanges] = useState([
    { minWeight: 0, maxWeight: 100, admissionChance: 50 }
  ])

  // Fetch programs on page load
  useEffect(() => {
    const fetchPrograms = async () => {
      const res = await fetch('/api/programs')
      const data = await res.json()
      setPrograms(data.programs)
    }
    fetchPrograms()
  }, [])

  // Add a new attribute
  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      {
        name: '',
        required: false,
        displayOrder: attributes.length + 1,
        conditions: [{ comparison: 'GREATER_THAN_OR_EQUAL', value: 0, weight: 0 }]
      }
    ])
  }

  // Add a new condition to a specific attribute
  const handleAddCondition = (index: number) => {
    const newAttributes = [...attributes]
    newAttributes[index].conditions.push({
      comparison: 'GREATER_THAN_OR_EQUAL',
      value: 0,
      weight: 0
    })
    setAttributes(newAttributes)
  }

  // Handle attribute changes
  const handleAttributeChange = (
    index: number,
    field: string,
    value: string | number | boolean
  ) => {
    const newAttributes = [...attributes]
    newAttributes[index][field] = value
    setAttributes(newAttributes)
  }

  // Handle condition changes
  const handleConditionChange = (
    attributeIndex: number,
    conditionIndex: number,
    field: string,
    value: string | number
  ) => {
    const newAttributes = [...attributes]
    newAttributes[attributeIndex].conditions[conditionIndex][field] = value
    setAttributes(newAttributes)
  }

  // Add a new weight range
  const handleAddWeightRange = () => {
    setWeightRanges([
      ...weightRanges,
      { minWeight: 0, maxWeight: 100, admissionChance: 50 }
    ])
  }

  // Handle weight range changes
  const handleWeightRangeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newWeightRanges: any = [...weightRanges]
    newWeightRanges[index][field] = value
    setWeightRanges(newWeightRanges)
  }

  // Submit the rule set
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/rules/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, programId: selectedProgram, attributes, weightRanges })
    })

    if (res.ok) {
      router.push('/dashboard') // Redirect to dashboard after successful creation
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-8">Create Rule Set</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule Set Name */}
        <div>
          <Label htmlFor="name">Rule Set Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            placeholder="Enter Rule Set Name"
          />
        </div>

        {/* Program Assignment */}
        <div>
          <Label htmlFor="program">Assign to Program</Label>
          <Select
            value={selectedProgram}
            onValueChange={setSelectedProgram}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program: any) => (
                <SelectItem key={program.program_id} value={program.program_id.toString()}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Attributes Section */}
        <h2 className="text-2xl">Attributes</h2>
        {attributes.map((attribute: any, index: number) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>{`Attribute ${index + 1}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`attribute-name-${index}`}>Attribute Name</Label>
                <Input
                  id={`attribute-name-${index}`}
                  value={attribute.name}
                  onChange={(e) =>
                    handleAttributeChange(index, 'name', e.target.value)
                  }
                  className="w-full"
                  placeholder="Enter Attribute Name (e.g., GPA, Coursework)"
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* Required Checkbox */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={attribute.required}
                    onChange={(e) =>
                      handleAttributeChange(index, 'required', e.target.checked)
                    }
                  />
                  <span>Required</span>
                </label>

                {/* Display Order */}
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={attribute.displayOrder}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        'displayOrder',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-20"
                  />
                </div>
              </div>

              {/* Conditions for Attributes */}
              {attribute.conditions.map((condition: any, conditionIndex: number) => (
                <div key={conditionIndex} className="flex items-center space-x-4">
                  {/* Comparison Operator */}
                  <select
                    value={condition.comparison}
                    onChange={(e) =>
                      handleConditionChange(
                        index,
                        conditionIndex,
                        'comparison',
                        e.target.value
                      )
                    }
                    className="px-2 py-2 border rounded"
                  >
                    <option value="GREATER_THAN_OR_EQUAL">&gt;=</option>
                    <option value="GREATER_THAN">&gt;</option>
                    <option value="LESS_THAN_OR_EQUAL">&lt;=</option>
                    <option value="LESS_THAN">&lt;</option>
                    <option value="EQUAL">==</option>
                  </select>

                  {/* Value */}
                  <Input
                    type="number"
                    step="0.01"
                    min={-100}
                    max={100}
                    value={condition.value}
                    onChange={(e) =>
                      handleConditionChange(
                        index,
                        conditionIndex,
                        'value',
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-24"
                    placeholder="Value"
                  />

                  {/* Weight */}
                  <div>
                    <Label>Weight</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={condition.weight}
                      onChange={(e) =>
                        handleConditionChange(
                          index,
                          conditionIndex,
                          'weight',
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-24"
                      placeholder="Weight"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={() => handleAddCondition(index)}
                variant="secondary"
              >
                Add Condition
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button type="button" onClick={handleAddAttribute} variant="secondary">
          Add Attribute
        </Button>

        {/* Weight Ranges Section */}
        <h2 className="text-2xl">Weight Ranges</h2>
        {weightRanges.map((range, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="flex items-center space-x-4">
              {/* Min Weight */}
              <div>
                <Label>Min Weight</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={range.minWeight}
                  onChange={(e) => {
                    handleWeightRangeChange(index, 'minWeight', parseInt(e.target.value))
                  }}
                  className="w-24"
                />
              </div>

              {/* Max Weight */}
              <div>
                <Label>Max Weight</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={range.maxWeight}
                  onChange={(e) =>
                    handleWeightRangeChange(index, 'maxWeight', parseInt(e.target.value))
                  }
                  className="w-24"
                />
              </div>

              {/* Admission Chance */}
              <div>
                <Label>Admission Chance (%)</Label>
                <Input
                  type="number"
                  value={range.admissionChance}
                  onChange={(e) =>
                    handleWeightRangeChange(
                      index,
                      'admissionChance',
                      parseInt(e.target.value)
                    )
                  }
                  className="w-24"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          onClick={handleAddWeightRange}
          variant="secondary"
        >
          Add Weight Range
        </Button>

        {/* Submit Button */}
        <Button type="submit" variant="default">
          Create Rule Set
        </Button>
      </form>
    </div>
  )
}
