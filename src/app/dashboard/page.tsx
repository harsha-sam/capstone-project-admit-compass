'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function Dashboard() {
  const router = useRouter()
  const [ruleSets, setRuleSets] = useState([])
  const [search, setSearch] = useState('')
  const [allRuleSets, setAllRuleSets] = useState([]) // Store all rule sets initially

  // Fetch all rule sets on initial load
  useEffect(() => {
    const fetchRuleSets = async () => {
      const res = await fetch('/api/rules/search') // Adjust this to the correct API route
      const data = await res.json()
      setRuleSets(data.ruleSets) // Display all rule sets initially
      setAllRuleSets(data.ruleSets) // Keep a copy of all rule sets for filtering
    }
    fetchRuleSets()
  }, [])

  // Filter rule sets by search input (program ID or name)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim() === "") {
      setRuleSets(allRuleSets) // Reset to all rule sets if search is empty
    } else {
      const filteredRuleSets = allRuleSets.filter((ruleSet: any) =>
        ruleSet.programs.some((program: any) =>
          program.name.toLowerCase().includes(search.toLowerCase()) ||
          program.program_id.toString().includes(search)
        )
      )
      setRuleSets(filteredRuleSets)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>
      
      <Button onClick={() => router.push('/rules/create')} variant="secondary">
        Create Rule Set
      </Button>

      {/* Search bar for searching rule sets */}
      <form onSubmit={handleSearch} className="mt-6 w-1/2">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Program Name or ID..."
        />
        <Button type="submit" className="ml-2 mt-4">Search</Button>
      </form>

      {/* List of Rule Sets */}
      <div className="mt-8">
        {ruleSets.length > 0 ? (
          ruleSets.map((ruleSet: any) => (
            <Card key={ruleSet.rule_id} className="mb-4 px-4 py-2 w-25">
              <h3 className="text-xl font-semibold">{ruleSet.name}</h3>

              {/* Display the associated programs for each rule set */}
              <div className="flex flex-wrap mt-2">
                {ruleSet.programs.map((program: any) => (
                  <span
                    key={program.program_id}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {program.name}
                  </span>
                ))}
              </div>

              {/* Edit Button */}
              <Button
                onClick={() => router.push(`/rules/edit/${ruleSet.rule_id}`)}
                variant="secondary"
              >
                Edit Rule Set
              </Button>
            </Card>
          ))
        ) : (
          <p>No rule sets found.</p>
        )}
      </div>
    </div>
  )
}
