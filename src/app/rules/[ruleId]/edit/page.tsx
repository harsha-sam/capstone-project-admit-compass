// src/app/rules/[ruleId]/edit/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'

export default function EditRuleSet() {
  const router = useRouter()
  const { ruleId } = useParams()
  
  const [name, setName] = useState('') // Rule set name
  const [programs, setPrograms] = useState([]) // List of programs
  const [selectedProgram, setSelectedProgram] = useState('') // Currently assigned program
  const [attributes, setAttributes] = useState([])
  const [weightRanges, setWeightRanges] = useState([])

  // Fetch the existing rule set data
  useEffect(() => {
    const fetchRuleSet = async () => {
      const res = await fetch(`/api/rules/${ruleId}`)
      const data = await res.json()

      if (data.ruleSet) {
        setName(data.ruleSet.name)
        setSelectedProgram(data.ruleSet.program_id)
        setAttributes(data.ruleSet.attributes)
        setWeightRanges(data.ruleSet.weight_ranges)
      }
    }
    fetchRuleSet()
  }, [ruleId])

  // Fetch the list of programs
  useEffect(() => {
    const fetchPrograms = async () => {
      const res = await fetch('/api/programs')
      const data = await res.json()
      setPrograms(data.programs)
    }
    fetchPrograms()
  }, [])

  // Handle updating attributes
  const handleAttributeChange = (index: number, field: string, value: string | number | boolean) => {
    const newAttributes = [...attributes]
    newAttributes[index][field] = value
    setAttributes(newAttributes)
  }

  // Handle updating conditions
  const handleConditionChange = (attributeIndex: number, conditionIndex: number, field: string, value: string | number) => {
    const newAttributes = [...attributes]
    newAttributes[attributeIndex].conditions[conditionIndex][field] = value
    setAttributes(newAttributes)
  }

  // Handle updating weight ranges
  const handleWeightRangeChange = (index: number, field: string, value: string | number) => {
    const newWeightRanges = [...weightRanges]
    newWeightRanges[index][field] = value
    setWeightRanges(newWeightRanges)
  }

  // Submit the updated rule set
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`/api/rules/${ruleId}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, programId: selectedProgram, attributes, weightRanges })
    })

    if (res.ok) {
      router.push('/dashboard') // Redirect after successful edit
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-8">Edit Rule Set</h1>
      <form onSubmit={handleSubmit}>
        {/* Rule Set Name */}
        <Card className="mb-6">
          <CardContent>
            <Label htmlFor="name">Rule Set Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="Enter Rule Set Name"
            />
          </CardContent>
        </Card>

        {/* Program Assignment */}
        <Card className="mb-6">
          <CardContent>
            <Label htmlFor="program">Assign to Program</Label>
            <Select
              id="program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full"
            >
              <option value="" disabled>Select Program</option>
              {programs.map(program => (
                <option key={program.program_id} value={program.program_id}>
                  {program.name}
                </option>
              ))}
            </Select>
          </CardContent>
        </Card>

        {/* Attributes Section */}
        <h2 className="text-2xl mb-4">Attributes</h2>
        {attributes.map((attribute, index) => (
          <Card key={index} className="mb-4">
            <CardContent>
              <Label htmlFor={`attribute-name-${index}`}>Attribute Name</Label>
              <Input
                id={`attribute-name-${index}`}
                value={attribute.name}
                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                className="w-full"
                placeholder="Enter Attribute Name (e.g., GPA, Coursework)"
              />

              <div className="flex items-center mt-4">
                {/* Required Checkbox */}
                <label className="mr-4">
                  <input
                    type="checkbox"
                    checked={attribute.required}
                    onChange={(e) => handleAttributeChange(index, 'required', e.target.checked)}
                  />
                  Required
                </label>

                {/* Display Order */}
                <Label className="mr-2">Display Order</Label>
                <Input
                  type="number"
                  value={attribute.display_order}
                  onChange={(e) => handleAttributeChange(index, 'display_order', parseInt(e.target.value))}
                  className="w-20"
                />
              </div>

              {/* Conditions for Attributes */}
              {attribute.conditions.map((condition, conditionIndex) => (
                <div key={conditionIndex} className="flex items-center mt-4">
                  {/* Comparison Operator */}
                  <select
                    value={condition.operator}
                    onChange={(e) => handleConditionChange(index, conditionIndex, 'operator', e.target.value)}
                    className="px-2 py-2 border rounded"
                  >
                    <option value=">=">&gt;=</option>
                    <option value=">">&gt;</option>
                    <option value="<=">&lt;=</option>
                    <option value="<">&lt;</option>
                  </select>

                  {/* Value */}
                  <Input
                    type="number"
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, conditionIndex, 'value', parseFloat(e.target.value))}
                    className="mx-2 px-3 py-2 border rounded w-24"
                    placeholder="Value"
                  />

                  {/* Weight */}
                  <Label className="block mx-2">Weight</Label>
                  <Input
                    type="number"
                    value={condition.weight}
                    onChange={(e) => handleConditionChange(index, conditionIndex, 'weight', parseFloat(e.target.value))}
                    className="px-3 py-2 border rounded w-24"
                    placeholder="Weight"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Weight Ranges Section */}
        <h2 className="text-2xl mb-4">Weight Ranges</h2>
        {weightRanges.map((range, index) => (
          <Card key={index} className="mb-4">
            <CardContent>
              <div className="flex items-center">
                {/* Min Weight */}
                <Label className="mr-2">Min Weight</Label>
                <Input
                  type="number"
                  value={range.min_weight}
                  onChange={(e) => handleWeightRangeChange(index, 'min_weight', parseInt(e.target.value))}
                  className="w-24 mr-4"
                />

                {/* Max Weight */}
                <Label className="mr-2">Max Weight</Label>
                <Input
                  type="number"
                  value={range.max_weight}
                  onChange={(e) => handleWeightRangeChange(index, 'max_weight', parseInt(e.target.value))}
                  className="w-24 mr-4"
                />

                {/* Admission Chance */}
                <Label className="mr-2">Admission Chance (%)</Label>
                <Input
                  type="number"
                  value={range.admission_chance}
                  onChange={(e) => handleWeightRangeChange(index, 'admission_chance', parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Submit Button */}
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </form>
    </div>
  )
}
