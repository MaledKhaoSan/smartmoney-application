// how to run
// bun run drizzle/scripts/02_generate_debtor.ts
import { db } from '../../src/lib/db';
import * as schema from '../schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Generating additional debtors...');

  // 1. Find the user 'somchai'
  const user = await db.query.users.findFirst({
    where: eq(schema.users.username, 'somchai')
  });

  if (!user) {
    throw new Error('User somchai not found. Please run 01_generate_users.ts first.');
  }

  // 2. Find the organization owned by somchai
  const org = await db.query.organizations.findFirst({
    where: eq(schema.organizations.ownerId, user.id)
  });

  if (!org) {
    throw new Error('Organization for somchai not found.');
  }

  // 3. Create more Debtors
  console.log(`Adding debtors to organization: ${org.name}`);
  
  const additionalDebtors = [
    {
      organizationId: org.id,
      name: 'นาย ง. เงินดี',
      phone: '084-444-4444',
      grade: 'A',
      note: 'เครดิตดีมาก',
    },
    {
      organizationId: org.id,
      name: 'นาง จ. จอมขยัน',
      phone: '085-555-5555',
      grade: 'B',
      note: 'ผ่อนจ่ายสม่ำเสมอ',
    },
    {
      organizationId: org.id,
      name: 'นาย ฉ. เฉื่อยแฉะ',
      phone: '086-666-6666',
      grade: 'C',
      note: 'ต้องคอยตามทวง',
    },
    {
      organizationId: org.id,
      name: 'นาง ช. ช่างเจรจา',
      phone: '087-777-7777',
      grade: 'B',
      note: 'ชอบขอลดดอก',
    },
    {
      organizationId: org.id,
      name: 'นาย ซ. ซื่อสัตย์',
      phone: '088-888-8888',
      grade: 'A',
      note: 'ลูกค้าประจำ',
    }
  ];

  const results = await db.insert(schema.debtors).values(additionalDebtors).returning();

  console.log(`Successfully added ${results.length} debtors!`);
  
  // 4. Create some loans for them
  console.log('Creating initial loans for new debtors...');
  const loansData = results.map((debtor, index) => ({
    debtorId: debtor.id,
    amount: (3000 + index * 1000).toFixed(2),
    interestRate: '10.00',
    interestDays: 1,
    interestType: 'daily',
    status: 'active',
    note: `เงินกู้เริ่มต้นสำหรับ ${debtor.name}`,
  }));

  await db.insert(schema.loans).values(loansData);
  console.log('Loans created successfully!');

  process.exit(0);
}

main().catch((e) => {
  console.error('Generation failed!');
  console.error(e);
  process.exit(1);
});
