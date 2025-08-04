import { z } from 'zod';

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, { message: 'Username/email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
const regexPasswordMessage =
  'Password must contain at least one uppercase letter, one lowercase letter, and one digit';

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    username: z
      .string()
      .min(1, { message: 'Username is required' })
      .max(10, { message: 'Username must be at most 10 characters' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(regexPassword, {
        message: regexPasswordMessage,
      }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters' })
      .regex(regexPassword, {
        message: regexPasswordMessage,
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
