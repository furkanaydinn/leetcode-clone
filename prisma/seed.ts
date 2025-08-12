import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
    },
  })

  // Create some sample problems
  const problems = await Promise.all([
    prisma.problem.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'EASY',
        category: 'Array',
        createdById: user.id,
      },
    }),
    prisma.problem.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.',
        difficulty: 'MEDIUM',
        category: 'Linked List',
        createdById: user.id,
      },
    }),
    prisma.problem.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        difficulty: 'MEDIUM',
        category: 'String',
        createdById: user.id,
      },
    }),
  ])

  console.log({ user, problems })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 