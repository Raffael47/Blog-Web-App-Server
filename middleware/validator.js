const { body, validationResult } = require('express-validator')

module.exports = {

    checkRegister: async( req, res, next ) => {
        try {
            await body('username').notEmpty().run(req);
            await body('email').notEmpty().isEmail().run(req);
            await body('phone').notEmpty().isMobilePhone().run(req);
            await body('password').notEmpty().isStrongPassword({
                minLength: 6,
                minSymbols: 1,
                minUppercase: 1,
                minLowercase: 1,
                minNumbers: 0
            }).run(req);
            await body('confirmPassword').notEmpty().equals(req.body.password).withMessage('Password does not match').run(req);

            const validation = validationResult(req);

            if (validation.isEmpty()) next()
            else throw { error: validation.array(), message: 'Invalid value' };

        } catch (err) {
            res.status(400).send(err)
        }
    },

    checkLogin: async( req, res, next ) => {
        try {
            await body('data').notEmpty().run(req);
            await body('password').notEmpty().isStrongPassword({
                minLength: 6,
                minSymbols: 1,
                minUppercase: 1,
                minLowercase: 1,
                minNumbers: 0
            }).run(req);

            const validation = validationResult(req);

            if (validation.isEmpty()) next()
            else throw { error: validation.array(), message: 'Invalid value' };

        } catch (err) {
            res.status(400).send(err)
        }
    },

    checkUsername: async( req, res, next ) => {
        try {
            await body('username').notEmpty().run(req);

            const validation = validationResult(req);

            if (validation.isEmpty()) next()
            else throw { message: 'Invalid value' };

        } catch (err) {
            res.status(400).send(err)
        }
    },

    checkEmail: async( req, res, next ) => {
        try {
            await body('email').notEmpty().isEmail().run(req);

            const validation = validationResult(req);

            if (validation.isEmpty()) next()
            else throw { message: 'Invalid value' };

        } catch (err) {
            res.status(400).send(err)
        }
    },

    checkPhone: async( req, res, next ) => {
        try {
            await body('phone').notEmpty().isMobilePhone().run(req);

            const validation = validationResult(req);

            if (validation.isEmpty()) next()
            else throw { message: 'Invalid value' };

        } catch (err) {
            res.status(400).send(err)
        }
    },

    checkChangePassword: async( req, res, next ) => {
        try {
            await body('currentPassword').notEmpty().isStrongPassword({
                minLength: 6,
                minSymbols: 1,
                minUppercase: 1,
                minLowercase: 1,
                minNumbers: 0
            }).run(req);
            await body('password').notEmpty().isStrongPassword({
                minLength: 6,
                minSymbols: 1,
                minUppercase: 1,
                minLowercase: 1,
                minNumbers: 0
            }).run(req);
            await body('confirmPassword').notEmpty().equals(req.body.password).withMessage('Password does not match').run(req);

            const validation = validationResult(req);

            if (validation.isEmpty()) next()
            else throw { message: 'Invalid value' };

        } catch (err) {
            res.status(400).send(err)
        }
    },

    checkResetPassword: async( req, res, next ) => {
        try {
            await body('password').notEmpty().isStrongPassword({
                minLength: 6,
                minSymbols: 1,
                minUppercase: 1,
                minLowercase: 1,
                minNumbers: 0
            }).run(req);
            await body('confirmPassword').notEmpty().equals(req.body.password).withMessage('Password does not match').run(req);

            const validation = validationResult(req);

            if (validation.isEmpty()) next()
            else throw { message: 'Invalid value' };

        } catch (err) {
            res.status(400).send(err)
        }
    },
}