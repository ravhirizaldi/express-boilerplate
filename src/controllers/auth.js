import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import logger from '../utils/logger.js';

/**
 * Handles user login.
 * Validates credentials, generates JWT, and returns user info.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    // Cari user by username atau email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Cek password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Buat JWT
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role?.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    logger.info(`User ${user.username} logged in`);

    res.json({
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role?.name,
      },
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
