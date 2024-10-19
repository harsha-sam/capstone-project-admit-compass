// src/app/programs/[programId]/apply/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ApplyProgram() {
  const { programId } = useParams() // Get programId from the URL params
  const [program, setProgram] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [admissionResult, setAdmissionResult] = useState(null)

  // Fetch the rule set when the page loads
  useEffect(() => {
    const fetchProgram = async () => {
      const res = await fetch(`/api/programs/${programId}/rule`)
      const data = await res.json()
      setProgram(data.ruleSet)
    }

    fetchProgram()
  }, [programId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Send the form values to the backend to calculate the admission chance
    const res = await fetch(`/api/programs/${programId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formValues })
    })
    const data = await res.json()
    setAdmissionResult(data)
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-8">{program ? program.name : 'Loading...'}</h1>

      <form onSubmit={handleSubmit}>
        {program ? (
          <>
            <p className="mb-6 text-lg">
              Please fill in the details below to get your acceptance criteria based on the current rule set.
            </p>

            {program.attributes.map((attr: any, index: number) => (
              <div key={index} className="mb-4">
                <label htmlFor={attr.name} className="block font-semibold">
                  {attr.name}
                </label>
                <input
                  type="number"
                  id={attr.name}
                  value={formValues[attr.name] || ''}
                  onChange={(e) => setFormValues({ ...formValues, [attr.name]: e.target.value })}
                  className="border rounded p-2 w-full"
                  placeholder={`Enter your ${attr.name}`}
                />
              </div>
            ))}

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>

            {/* Display the result */}
            {admissionResult && (
              <div className="mt-6">
                <p>{admissionResult.message}</p>
                <p className="font-bold text-lg">{`Your estimated chance of admission is 50%.`}</p>
              </div>
            )}
          </>
        ) : (
          <p>Loading rule set...</p>
        )}
      </form>
    </div>
  )
}
