import { db } from '@/lib/db';
import { loans } from '../../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

export const loanService = {
  /**
   * Get all loans for a specific debtor
   */
  async getByDebtor(debtorId: number) {
    return await db.query.loans.findMany({
      where: eq(loans.debtorId, debtorId),
      orderBy: [desc(loans.createdAt)]
    });
  },

  /**
   * Create a new loan record with interest details (cycle based)
   */
  async create(data: typeof loans.$inferInsert) {
    return await db.insert(loans).values(data).returning();
  },

  /**
   * Mark a loan as paid or update its status
   */
  async updateStatus(id: number, status: 'active' | 'paid' | 'overdue') {
    return await db.update(loans)
      .set({ status })
      .where(eq(loans.id, id))
      .returning();
  },

  /**
   * Record a payment (can be expanded to a separate payments table later)
   */
  async markAsPaid(id: number) {
    return this.updateStatus(id, 'paid');
  }
};
