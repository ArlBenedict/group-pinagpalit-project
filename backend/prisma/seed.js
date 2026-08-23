const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function main() {
  const pass = await bcrypt.hash('password', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fithit.local' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@fithit.local',
      password: pass,
      role: 'ADMIN'
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@fithit.local' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@fithit.local',
      password: pass,
      role: 'USER'
    }
  })

  console.log({ admin: admin.email, user: user.email })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
