import { authHandlers } from './auth';
import { productHandlers } from './products';
import { orderHandlers } from './orders';
import { analyticsHandlers } from './analytics';

export const handlers = [...authHandlers, ...productHandlers, ...orderHandlers, ...analyticsHandlers];
