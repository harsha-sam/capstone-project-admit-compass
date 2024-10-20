/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Import the router for navigation
import { Card } from '@/components/ui/card'  // Using shadcn/ui
import { ChevronDownIcon } from '@heroicons/react/24/solid'

export default function ProgramList() {
  const [showBachelor, setShowBachelor] = useState(true)
  const [showAccelerated, setShowAccelerated] = useState(false)
  const [showProfessional, setShowProfessional] = useState(false)
  const [showDoctorate, setShowDoctorate] = useState(false)
  const [groupedPrograms, setGroupedPrograms] = useState<any>({
    bachelor: [],
    accelerated: [],
    professional: [],
    doctorate: []
  })

  const router = useRouter() // Initialize router for navigation

  // Fetch programs from the API and group them by type
  useEffect(() => {
    const fetchPrograms = async () => {
      const res = await fetch('/api/programs')
      const { programs } = await res.json()

      // Group the programs based on type
      const grouped = {
        bachelor: programs.filter((program: any) => program.type === `Bachelor's And Minor`),
        accelerated: programs.filter((program: any) => program.type === `Accelerated Bachelor's/Master's Programs`),
        professional: programs.filter((program: any) => program.type === `Applied and Professional Master’s Programs`),
        doctorate: programs.filter((program: any) => program.type === `Master’s and Doctorate Programs`)
      }

      setGroupedPrograms(grouped)
    }

    fetchPrograms()
  }, [])

  const toggleSection = (section: string) => {
    switch (section) {
      case 'bachelor':
        setShowBachelor(!showBachelor)
        break
      case 'accelerated':
        setShowAccelerated(!showAccelerated)
        break
      case 'professional':
        setShowProfessional(!showProfessional)
        break
      case 'doctorate':
        setShowDoctorate(!showDoctorate)
        break
      default:
        break
    }
  }

  // Handle navigation to the apply page for the selected program
  const handleCardClick = (programId: number) => {
    router.push(`/programs/${programId}/apply`) // Navigate to the apply page for the program
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">UMBC Engineering Programs</h1>

        {/* Introductory Text about AdmitCompass */}
        <div className="mb-12">
          <p className="text-lg text-center max-w-3xl mx-auto">
            <strong>Admit Compass</strong> {`is your digital mentor, designed to help prospective students assess their chances of admission to UMBC's prestigious engineering programs. Whether you're aiming for an undergraduate or graduate degree, AdmitCompass guides you through the application process, providing personalized insights into program requirements and offering an estimated acceptance rate based on your qualifications. This tool helps you understand where you stand in your journey towards admission, giving you the confidence to make informed decisions.`}
          </p>
        </div>

        {/* Bachelor's Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('bachelor')}>
            <h2 className="text-2xl font-semibold">{`Bachelors and Minor Programs`}</h2>
            <ChevronDownIcon className={`h-6 w-6 transform ${showBachelor ? 'rotate-180' : ''}`} />
          </div>
          {showBachelor && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPrograms.bachelor.map((program: any, index: number) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() => handleCardClick(program.program_id)} // Navigate to the apply page when clicked
                >
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Accelerated Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('accelerated')}>
            <h2 className="text-2xl font-semibold">{`Accelerated Bachelor's/Master's Programs`}</h2>
            <ChevronDownIcon className={`h-6 w-6 transform ${showAccelerated ? 'rotate-180' : ''}`} />
          </div>
          {showAccelerated && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPrograms.accelerated.map((program: any, index: number) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() => handleCardClick(program.program_id)} // Navigate to the apply page when clicked
                >
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Professional Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('professional')}>
            <h2 className="text-2xl font-semibold">Applied and Professional Master’s Programs</h2>
            <ChevronDownIcon className={`h-6 w-6 transform ${showProfessional ? 'rotate-180' : ''}`} />
          </div>
          {showProfessional && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPrograms.professional.map((program: any, index: number) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() => handleCardClick(program.program_id)} // Navigate to the apply page when clicked
                >
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Doctorate Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('doctorate')}>
            <h2 className="text-2xl font-semibold">Master’s and Doctorate Programs</h2>
            <ChevronDownIcon className={`h-6 w-6 transform ${showDoctorate ? 'rotate-180' : ''}`} />
          </div>
          {showDoctorate && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPrograms.doctorate.map((program: any, index: number) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() => handleCardClick(program.program_id)} // Navigate to the apply page when clicked
                >
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
