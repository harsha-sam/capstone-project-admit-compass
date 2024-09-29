// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


// Define the program structure with explicit types
const programs: {
  name: string
  type: string
  url: string
}[] = [
  // Bachelor's and Minor Programs
  { name: 'Business Technology Administration (B.A.)', type: `Bachelor's And Minor`, url: '/programs/business-technology-administration' },
  { name: 'Chemical Engineering (B.S.)', type: `Bachelor's And Minor`, url: '/programs/chemical-engineering' },
  { name: 'Computer Engineering (B.S.)', type: `Bachelor's And Minor`, url: '/programs/computer-engineering' },
  { name: 'Computer Science (B.S.)', type: `Bachelor's And Minor`, url: '/programs/computer-science' },
  { name: 'Information Systems (B.S.)', type: `Bachelor's And Minor`, url: '/programs/information-systems' },
  { name: 'Mechanical Engineering (B.S.)', type: `Bachelor's And Minor`, url: '/programs/mechanical-engineering' },

  // Accelerated Bachelor's/Master's Programs
  { name: 'Business Technology Administration/Human-Centered Computing (B.A./M.S.)', type: `Accelerated Bachelor's/Master's Programs`, url: '/programs/business-tech-admin-human-centered-computing' },
  { name: 'Chemical Engineering/Environmental Engineering (B.S./M.S.)', type: `Accelerated Bachelor's/Master's Programs`, url: '/programs/chemical-engineering-environmental-engineering' },
  { name: 'Computer Science/Data Science (B.S./M.P.S.)', type: `Accelerated Bachelor's/Master's Programs`, url: '/programs/computer-science-data-science' },

  // Master's and Doctorate Programs
  { name: 'Data Science (M.P.S.)', type: `Applied and Professional Master’s Programs`, url: '/programs/data-science' },
  { name: 'Engineering Management (M.S.)', type: `Applied and Professional Master’s Programs`, url: '/programs/engineering-management' },
  { name: 'Software Engineering (M.P.S.)', type: `Applied and Professional Master’s Programs`, url: '/programs/software-engineering' },
  { name: 'Chemical Engineering (M.S., Ph.D.)', type: `Master’s and Doctorate Programs`, url: '/programs/chemical-engineering-doctorate' },
  { name: 'Computer Science (M.S., Ph.D.)', type: `Master’s and Doctorate Programs`, url: '/programs/computer-science-doctorate' },
  { name: 'Cybersecurity (M.S.)', type: `Master’s and Doctorate Programs`, url: '/programs/cybersecurity' },
  { name: 'Electrical Engineering (M.S., Ph.D.)', type: `Master’s and Doctorate Programs`, url: '/programs/electrical-engineering-doctorate' }
]

async function main() {
  for (const program of programs) {
    await prisma.program.create({
      data: program,
    })
  }

  console.log('Programs have been seeded!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
