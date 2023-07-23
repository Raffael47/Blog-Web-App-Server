const db = require('../models');
const user = db.user;
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const transporter = require('../middleware/transporter');
const handlebars = require('handlebars')

module.exports = {
    register: async(req, res) => {
        try {
            const {username, email, phone, password} = req.body;

            const isUsernameExist = await user.findOne({ where: { username } });
            if (isUsernameExist) {
                return res.status(409).send({
                    message: 'Username has already been used'
                })
            };

            const isEmailExist = await user.findOne({ where: { email } });
            if (isEmailExist) {
                return res.status(409).send({
                    message: 'Email has already been used'
                })
            };

            const salt = await bcrypt.genSalt(8);
            const hashPassword = await bcrypt.hash(password, salt);

            const result = await user.create({username, email, phone, password: hashPassword});
            
            const payload = {id: result.id};
            const token = jwt.sign(payload, process.env.KEY_JWT);
            
            await user.update({ token }, { where: { username } })
            
            const data = await fs.readFileSync('./template/verify.html', 'utf-8');
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({
                name: 'Account', 
                action: 'Verify', 
                link: `http://localhost:8000/auth/verify/${token}`
            });

            await transporter.sendMail({
                from: 'fabrizio.thegreen@gmail.com',
                to: email,
                subject: 'Verify Account',
                html: tempResult
            });

            res.status(201).send({
                status: true,
                message: 'Register successful',
                result,
                token
            });
            
        } catch (err) {
            console.log(err)
            res.status(400).send('Register Failed');
        }
    },

    verifyUser: async(req, res) => {
        try {
            const result = await user.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (result.token !== req.token) throw { message: 'Invalid Token' }
            
            await user.update({ isVerified: true, token: null }, {
                where: {
                    id: req.user.id
                }
            });

            res.status(200).send({
                status: true,
                message: 'Account Verified'
            });

        } catch (err) {
            res.status(400).send(err);
        }
    },

    login: async(req, res) => {
        try {
            const { data, password } = req.body;
            const result = await user.findOne({
                where: {
                    [Op.or]: [{username: data}, {email: data}, {phone: data}]
                },
                attributes: {
                    exclude: [
                        'token',
                        'updatedAt'
                    ]
                }
            });

            if ( !result.isVerified ) throw { message: 'Account unverified' };

            if (!result) throw {message: 'User not found'};

            const isValid = await bcrypt.compare(password, result.password);
            if (!isValid) throw {message: 'Password is incorrect, please check again your password'};

            const payload = {id: result.id, isVerified: result.isVerified};
            const token = jwt.sign(payload, process.env.KEY_JWT, {expiresIn: '1d'});

            res.status(200).send({
                status: true,
                message: 'Log in successful',
                token,
                result
            });

        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    },

    keepLogin: async(req, res) => {
        try {
            const result = await user.findOne({
                where: {
                    id: req.user.id
                },
                attributes: {
                    exclude: [
                        'token',
                        'updatedAt',
                        'password',
                        'isVerified'
                    ]
                }
            });
            
            res.status(200).send({
                status: true,
                result
            });
        } catch (err) {
            res.status(400).send(err);
        }
    },

    forgotPassword: async(req, res) => {
        try {
            const { email } = req.body;

            const result = await user.findOne({ where: { email } });
            if (!result) throw { message: 'User not found' };
            
            const payload = { id: result.id };
            const token = jwt.sign(payload, process.env.KEY_JWT, {expiresIn: '10m'});

            const data = await fs.readFileSync('./template/verify.html', 'utf-8');
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({ 
                name: 'Password', 
                action: 'Reset',
                link: `http://localhost:8000/user/reset-pass/${token}`
            });

            await transporter.sendMail({
                from: 'fabrizio.thegreen@gmail.com',
                to: email,
                subject: 'Reset Password',
                html: tempResult
            });
            
            res.status(200).send({
                status: true,
                message: 'Email sent',
                token
            })

        } catch (err) {
            res.status(400).send(err);
        }
    }
};