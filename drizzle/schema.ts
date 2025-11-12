import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

//Esquemas de la tabla de usuarios
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),

});

//Esquema de la tabla de links
export const links = pgTable('links', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  urlOriginal: text('url_original').notNull(),
  urlCortado: text('url_cortado').notNull().unique(), 
  clicks: integer('clicks').default(0),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
