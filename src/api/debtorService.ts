import { db } from '@/lib/db';
import { debtors, loans } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const debtorService = {
  /**
   * Get all debtors for an organization, including their current active loans
   */
  async getAllByOrganization(organizationId: number) {
    return await db.query.debtors.findMany({
      where: eq(debtors.organizationId, organizationId),
      with: {
        loans: {
          where: eq(loans.status, 'active')
        }
      }
    });
  },

  /**
   * Create a new debtor record
   */
  async create(data: typeof debtors.$inferInsert) {
    return await db.insert(debtors).values(data).returning();
  },

  /**
   * Update debtor details or grade
   */
  async update(id: number, data: Partial<typeof debtors.$inferInsert>) {
    return await db.update(debtors)
      .set(data)
      .where(eq(debtors.id, id))
      .returning();
  },

  /**
   * Analyze and calculate debtor grade based on payment history
   * Mock implementation for now
   */
  analyzeGrade(debtorId: number, loans: any[]) {
    const overdueLoans = loans.filter(l => l.status === 'overdue').length;
    if (overdueLoans === 0) return 'A';
    if (overdueLoans === 1) return 'B';
    return 'C';
  }
};
