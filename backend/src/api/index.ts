import { Router } from 'express';
import authRoutes from './routes/auth.routes';

const router = Router();

router.use('/auth', authRoutes);

// Other resource routes (orders, customers, etc.) will be added here
// router.use('/orders', orderRoutes);

export default router;
