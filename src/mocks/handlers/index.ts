import { authHandlers } from './auth';
import { productHandlers } from './products';
import { orderHandlers } from './orders';
import { analyticsHandlers } from './analytics';
import { userHandlers } from './users';
import { adminHandlers } from './admin';

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...orderHandlers,
  ...analyticsHandlers,
  ...userHandlers,
  ...adminHandlers,
];
