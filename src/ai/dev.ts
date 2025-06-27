import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-product-description.ts';
import '@/ai/flows/suggest-product-category.ts';
import '@/ai/flows/generate-product-description.ts';