import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'demo@example.com',
      name: 'Demo User',
      consentedToAI: true,
    },
  });

  console.log('Created demo user:', user.email);

  const healthData = await prisma.healthData.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      weight: 70,
      height: 175,
      bloodPressure: '120/80',
      heartRate: 75,
      bloodType: 'O+',
      allergies: ['peanuts'],
      medications: ['multivitamin'],
      conditions: [],
      lastCheckup: new Date(),
    },
  });

  console.log('Created health data for user');

  const familyMember = await prisma.familyMember.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      userId: user.id,
      name: 'Jane Doe',
      relationship: 'Spouse',
      consentedToAI: true,
    },
  });

  console.log('Created family member:', familyMember.name);

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: 'General Health Questions',
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hello, I have some questions about healthy eating.',
            usedHealthData: false,
          },
          {
            role: 'assistant',
            content:
              'Hello! I\'d be happy to help you with questions about healthy eating. A balanced diet is key to maintaining good health. What specific aspects of healthy eating would you like to know more about? For example, meal planning, portion sizes, specific nutrients, or dietary patterns?',
            usedHealthData: false,
          },
        ],
      },
    },
  });

  console.log('Created demo conversation:', conversation.title);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
