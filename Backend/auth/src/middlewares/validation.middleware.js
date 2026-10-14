import { body, validationResult } from 'express-validator';

async function validate(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next();
}

export const registerUserValidationRules = [
    body('email').isEmail().withMessage('Invalid Email Address'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 characters'),
    body('fullName.firstName').notEmpty().withMessage('First name is required'),
    body('fullName.lastName').notEmpty().withMessage('last name is required'),
    validate
]

export const loginUserValidation = [
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 characters'),
    validate
]