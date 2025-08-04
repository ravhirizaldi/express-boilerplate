import { ZodError } from 'zod';

/** * Middleware to validate request body against a Zod schema.
 * @param {Object schema} schema - The Zod schema to validate against.
 * @returns {Function} - Express middleware function.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Ambil array error langsung kalau ada
      const details = Array.isArray(error.errors) ? error.errors : JSON.parse(error.message);

      return res.status(400).json({
        message: 'Validation failed',
        errors: details.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    return res.status(400).json({
      message: error?.message || 'Invalid request body',
      errors: [],
    });
  }
};
