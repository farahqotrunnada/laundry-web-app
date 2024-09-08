import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .toLowerCase(),
  body('password').trim(),
  // .notEmpty()
  // .withMessage('Password is required')
  // .isLength({ min: 5 })
  // .withMessage('Password must be at least 5 characters long'),
  body('first_name').trim().notEmpty().withMessage('First Name is required'),
  body('last_name').trim().notEmpty().withMessage('First Name is required'),
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Phone Number is required')
    .isNumeric()
    .withMessage('Phone Number must be a valid number'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array() });
    }

    next();
  },
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .toLowerCase(),
  body('password').trim().notEmpty().withMessage('Password is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array() });
    }

    next();
  },
];

// ======================================== NON-USER VALIDATOR ========================================

export const validateAgentRegister = [
  body('username').not().isEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role_id').isInt().withMessage('Role ID is required'),
  body('outlet_id').optional().isInt(),
  body('worker_type').optional().isIn(['WASHING', 'IRONING', 'PACKING']),
];

export const validateAgentLogin = [
  body('username').not().isEmpty().withMessage('Username is required'),
  body('password').not().isEmpty().withMessage('Password is required'),
];
