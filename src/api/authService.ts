'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/lib/db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

/**
 * เข้าสู่ระบบด้วยอีเมลหรือชื่อผู้ใช้งาน + รหัสผ่าน
 * ถ้า identifier ไม่ใช่อีเมล จะหาอีเมลจาก username ในฐานข้อมูลก่อน
 */
export async function loginAction(formData: FormData) {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;

  if (!identifier || !password) {
    return { error: 'กรุณากรอกอีเมล/ชื่อผู้ใช้งาน และรหัสผ่าน' };
  }

  // ตรวจสอบว่าเป็นอีเมลหรือ username
  const isEmail = identifier.includes('@');
  let email = identifier;

  if (!isEmail) {
    // หา email จาก username
    const user = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.username, identifier))
      .limit(1);

    if (!user.length || !user[0].email) {
      return { error: 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบ' };
    }

    email = user[0].email;
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'อีเมล/ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง' };
  }

  redirect('/dashboard');
}

/**
 * ออกจากระบบ
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

/**
 * ดึงข้อมูล user profile ปัจจุบัน (Supabase Auth + users table)
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  // ดึงข้อมูลเพิ่มเติมจาก users table
  const profile = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1);

  return profile.length
    ? { ...profile[0], authEmail: authUser.email }
    : null;
}
