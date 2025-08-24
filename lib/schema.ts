import { pgTable, serial, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  image: varchar('image', { length: 255 }),
  slug: varchar('slug', { length: 255 }),
  ebookCount: integer('ebookCount'),
  price: integer('price'),
  originalPrice: integer('originalPrice'),
  driveLink: varchar('driveLink', { length: 255 }),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  emailVerified: timestamp('emailVerified'),
  name: varchar('name', { length: 255 }),
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 255 }),
  provider: varchar('provider', { length: 255 }),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});


export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  userId: integer('userId'),
  categoryId: integer('categoryId'),
  orderId: varchar('orderId', { length: 255 }),
  amount: integer('amount'),
  status: varchar('status', { length: 50 }),
  paymentMethod: varchar('paymentMethod', { length: 50 }),
  paymentType: varchar('paymentType', { length: 50 }),
  transactionId: varchar('transactionId', { length: 255 }),
  snapToken: varchar('snapToken', { length: 255 }),
  emailSent: integer('emailSent'), // 0 = false, 1 = true
  downloadLink: varchar('downloadLink', { length: 255 }),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});
