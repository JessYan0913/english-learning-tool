'use server';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { user, type User } from '@/lib/db/schema';

export async function getUser(email: string): Promise<User | null> {
  const db = getDb();

  const result = await db.select().from(user).where(eq(user.email, email)).limit(1);

  return result[0] || null;
}

export async function createUser(data: { email: string; password: string }): Promise<User> {
  const db = getDb();

  const salt = genSaltSync(10);
  const hash = hashSync(data.password, salt);

  const result = await db
    .insert(user)
    .values({
      email: data.email,
      password: hash,
    })
    .returning();

  return result[0];
}
