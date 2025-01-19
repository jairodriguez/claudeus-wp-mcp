import { config } from 'dotenv';

config();

export const DEFAULT_SITE = process.env.DEFAULT_SITE || 'default_test'; 