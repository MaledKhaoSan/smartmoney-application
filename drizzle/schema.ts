import { pgTable, serial, text, varchar, timestamp, pgEnum, decimal, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define roles for the system
export const roleEnum = pgEnum('role', ['super-admin', 'super-user', 'member']);

// Users table handles login and core identity
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 256 }).unique(),
  fullName: text('full_name').notNull(),
  email: varchar('email', { length: 256 }).unique(),
  phone: varchar('phone', { length: 256 }),
  role: roleEnum('role').default('super-user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Organizations (or Groups) owned by a super-user/class-leader
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  debtors: many(debtors),
}));

// Debtors (Members) - these are records to track, not necessarily login users
export const debtors = pgTable('debtors', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 256 }),
  address: text('address'),
  grade: text('grade'), // Analysis grade (e.g., A, B, C)
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const debtorsRelations = relations(debtors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [debtors.organizationId],
    references: [organizations.id],
  }),
  loans: many(loans),
}));

// Loan records to track borrowing, interest, and duration
export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  debtorId: integer('debtor_id').references(() => debtors.id).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(), // Percentage, e.g., 5.00 for 5%
  interestDays: integer('interest_days').notNull(), // Cycle duration (e.g., 1 day, 24 days)
  interestType: text('interest_type').default('daily').notNull(), // Type of interest calculation (daily, fixed, etc.)
  startDate: timestamp('start_date').defaultNow().notNull(),
  dueDate: timestamp('due_date'),
  status: text('status').default('active').notNull(), // e.g., 'active', 'paid', 'overdue'
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const loansRelations = relations(loans, ({ one }) => ({
  debtor: one(debtors, {
    fields: [loans.debtorId],
    references: [debtors.id],
  }),
}));