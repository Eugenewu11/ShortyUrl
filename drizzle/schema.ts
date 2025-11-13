import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

//Tabla usuarios
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

//Tabla links
export const links = pgTable('links', {
  id: text('id').primaryKey(),
  urlOriginal: text('url_original').notNull(),
  urlCortado: text('url_cortado').notNull().unique(), 
  clicks: integer('clicks').default(0),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
