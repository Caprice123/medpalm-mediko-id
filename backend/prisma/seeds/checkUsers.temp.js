import prisma from '#prisma/client'
const users = await prisma.users.findMany({ select: { id: true, email: true, role: true }, take: 5 })
console.log(JSON.stringify(users, null, 2))
await prisma.$disconnect()
