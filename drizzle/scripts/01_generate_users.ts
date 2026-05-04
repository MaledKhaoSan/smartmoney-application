import { db } from '../../src/lib/db';
import * as schema from '../schema';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Seed started...');

  // Clear existing items in logical order
  console.log('Cleaning up existing data...');
  try {
    // Note: We truncate in reverse order of dependencies
    await db.execute(sql`TRUNCATE TABLE ${schema.loans}, ${schema.debtors}, ${schema.organizations}, ${schema.users} RESTART IDENTITY CASCADE`);
  } catch (err) {
    console.log('Some tables might not exist yet or truncation failed, skipping...');
    console.error(err);
  }

  // Create mock data
  console.log('Inserting mock data...');

  const userId = '0776b911-381a-4d2c-8597-2c90c765955a';
  const userEmail = 'somchai@smartmoney.com';
  // รหัสผ่านคือ password123 (hashed ด้วย bcrypt)
  const hashedPassword = '$2a$10$7793N6H6N6H6N6H6N6H6OuXy8H6H6N6H6N6H6N6H6N6H6N6H6N6H6'; 

  console.log('Creating Auth User in Supabase...');
  try {
    // 1. สร้าง User ในระบบ Auth ของ Supabase (ถ้ายังไม่มี)
    // เราใช้การยิง SQL ตรงเข้าตาราง auth.users ของ Supabase
    await db.execute(sql`
      INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
      VALUES (
        ${userId},
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        ${userEmail},
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        '',
        '',
        ''
      ) ON CONFLICT (id) DO UPDATE SET email = ${userEmail};
    `);

    // 2. สร้าง Identity เพื่อให้ Supabase รู้ว่าเป็นวิธีล็อกอินแบบ email
    await db.execute(sql`
      INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
      VALUES (
        ${userId},
        ${userId},
        jsonb_build_object('sub', ${userId}, 'email', ${userEmail}),
        'email',
        now(),
        now(),
        now()
      ) ON CONFLICT (id, provider) DO NOTHING;
    `);
  } catch (err) {
    console.log('Note: Auth user creation might have some issues if permissions are restricted, but trying to continue...');
    // console.error(err);
  }

  // 1. Create the Class Leader (Super User) in public schema
  const [classLeader] = await db.insert(schema.users).values({
    id: userId,
    username: 'somchai',
    fullName: 'คุณครู สมชาย',
    email: userEmail,
    role: 'super-user',
  }).onConflictDoUpdate({
    target: schema.users.id,
    set: { username: 'somchai', fullName: 'คุณครู สมชาย', email: userEmail }
  }).returning();

  console.log(`Created user profile: ${classLeader.fullName} (${classLeader.username})`);

  // 2. Create an Organization for the Leader
  const [org] = await db.insert(schema.organizations).values({
    name: 'กลุ่มมิตรแท้ (สมชาย)',
    ownerId: classLeader.id,
  }).returning();

  console.log(`Created organization: ${org.name}`);

  // 3. Create Debtors
  const debtorsData = await db.insert(schema.debtors).values([
    {
      organizationId: org.id,
      name: 'นาย ก. มั่งคั่ง',
      phone: '081-234-5678',
      grade: 'A',
      note: 'จ่ายตรงตลอด',
    },
    {
      organizationId: org.id,
      name: 'นาง ข. พอมี',
      phone: '082-222-3333',
      grade: 'B',
      note: 'มีล่าช้าบ้างบางครั้ง',
    },
    {
      organizationId: org.id,
      name: 'นาย ค. ขี้งอน',
      phone: '083-333-3333',
      grade: 'C',
      note: 'ตามตัวยากและมักจะค้างจ่าย',
    },
  ]).returning();

  const [debtorA, debtorB, debtorC] = debtorsData;
  console.log(`Created ${debtorsData.length} debtors`);

  // 4. Create Loans with different cycles
  await db.insert(schema.loans).values([
    {
      debtorId: debtorA.id,
      amount: '5000.00',
      interestRate: '5.00',
      interestDays: 1, // ดอกละวัน
      interestType: 'daily',
      status: 'active',
      note: 'กู้รายวัน จ่ายตรงเวลา',
    },
    {
      debtorId: debtorB.id,
      amount: '10000.00',
      interestRate: '15.00',
      interestDays: 24, // ดอกละ 24 วัน
      interestType: 'custom-cycle',
      status: 'active',
      note: 'กู้ระยะสั้น 24 วัน',
    },
    {
      debtorId: debtorC.id,
      amount: '2000.00',
      interestRate: '10.00',
      interestDays: 7, // ดอกรายสัปดาห์
      interestType: 'daily',
      status: 'overdue',
      note: 'ค้างจ่ายมาเกือบเดือนแล้ว',
    },
  ]);

  console.log('Seed finished successfully!');
  process.exit(0);
}

main().catch((e) => {
  console.error('Seed failed!');
  console.error(e);
  process.exit(1);
});
