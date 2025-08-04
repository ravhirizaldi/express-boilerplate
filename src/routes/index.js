import { Router } from 'express';
import authRoutes from './auth-routes.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use(authenticate);

export default router;
