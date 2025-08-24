export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('userId', { length: 255 }),
  type: varchar('type', { length: 255 }),
  provider: varchar('provider', { length: 255 }),
  providerAccountId: varchar('providerAccountId', { length: 255 }),
  refresh_token: varchar('refresh_token', { length: 255 }),
  access_token: varchar('access_token', { length: 255 }),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: varchar('id_token', { length: 255 }),
  session_state: varchar('session_state', { length: 255 }),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  sessionToken: varchar('sessionToken', { length: 255 }),
  userId: varchar('userId', { length: 255 }),
  expires: timestamp('expires'),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});
import { pgTable, serial, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: varchar('id', { length: 255 }).primaryKey(),
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
  id: varchar('id', { length: 255 }).primaryKey(),
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
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('userId', { length: 255 }),
  categoryId: varchar('categoryId', { length: 255 }),
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
