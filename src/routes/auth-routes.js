import { Router } from 'express';
import { login } from '../controllers/auth.js';
import { loginSchema } from '../validators/auth-validator.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// POST /auth/login → Public route
router.post('/login', validate(loginSchema), login);

export default router;
