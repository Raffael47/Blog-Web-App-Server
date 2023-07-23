const db = require('../models');
const user = db.user;
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const fs = require('fs');
const transporter = require('../middleware/transporter');
const handlebars = require('handlebars');

module.exports = {
    editUsername: async(req, res) => {
        try {
            const { username } = req.body;

            const isUsernameExist = await user.findOne({ where: { username } });
            if (isUsernameExist) {
                return res.status(409).send({
                    message: 'Username has already been used'
                })
            };

            const result = await user.findOne({ where: { id: req.user.id } });

             await user.update({ username }, {
                where: {
                    id: req.user.id
                }
            });

            const data = await fs.readFileSync('./template/notice.html', 'utf-8');
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({ name: 'Username' });

            await transporter.sendMail({
                from: 'fabrizio.thegreen@gmail.com',
                to: result.email,
                subject: 'Username Updated',
                html: tempResult
            });
    
            res.status(200).send({
                status: true,
                message: 'Username updated'
            });
            
        } catch (err) {
            await t.rollback;
            res.status(400).send(err);
        }
    },
    
    editEmail: async(req, res) => {
        try {
            const { email } = req.body;

            const isEmailExist = await user.findOne({ where: { email } });
            if (isEmailExist) {
                return res.status(409).send({
                    message: 'Email has already been used'
                })
            };

            const result = await user.findOne({ where: { id: req.user.id } });

            const payload = {id: req.user.id};
            const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: '1d' })

             await user.update({ email, isVerified: false, token }, {
                where: {
                    id: req.user.id
                }
            });

            const data = await fs.readFileSync('./template/verify.html', 'utf-8');
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({
                name: 'Email', 
                action: 'Verify',
                link: `http://localhost:8000/auth/verify/${token}`
            });

            await transporter.sendMail({
                from: 'fabrizio.thegreen@gmail.com',
                to: result.email,
                subject: 'Verify Email',
                html: tempResult
            });
    
            res.status(200).send({
                status: true,
                message: 'Email updated',
                token
            });
            
        } catch (err) {
            res.status(400).send(err);
        }
    },
    
    editPhone: async(req, res) => {
        try {
            const { phone } = req.body;
            const result = await user.findOne({ where: { id: req.user.id } });

             await user.update({ phone }, {
                where: {
                    id: req.user.id
                }
            });

            const data = await fs.readFileSync('./template/notice.html', 'utf-8');
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({ name: 'Phone Number' });

            await transporter.sendMail({
                from: 'fabrizio.thegreen@gmail.com',
                to: result.email,
                subject: 'Phone Number Updated',
                html: tempResult
            });
    
            res.status(200).send({
                status: true,
                message: 'Phone updated'
            });
            
        } catch (err) { 
            res.status(400).send(err);
        }
    },  

    changePassword: async(req, res) => {
        try {
            const { currentPassword, password } = req.body
            const result = await user.findOne({
                where: {
                    id: req.user.id
                }
            });

            const isValid = await bcrypt.compare(currentPassword, result.password);
            if (!isValid) throw {message: 'Password is incorrect, please check again your password'};

            const salt = await bcrypt.genSalt(8);
            const hashPassword = await bcrypt.hash(password, salt);

            await user.update({
                password: hashPassword
            }, {
                where: {
                    id: req.user.id
                }
            });

            res.status(200).send({
                status: true, 
                message: 'Password updated'
            });

        } catch (err) {
            res.status(400).send(err);
        }
    },

    resetPassword: async(req, res) => {
        try {
            const { password } = req.body;

            const salt = await bcrypt.genSalt(8);
            const hashPassword = await bcrypt.hash(password, salt);

            await user.update({
                password: hashPassword
            }, {
                where: {
                    id: req.user.id
                }
            });

            res.status(200).send({
                status: true, 
                message: 'Reset password successful'
            });

        } catch (err) {
            res.status(400).send(err);
        }
    },

    uploadAvatar: async(req, res) => {
        try {
            const { filename, size } = req.file;
            if (size > 1000000) throw {
                message: 'File size is too large'
            };

            await user.update({ imgProfile: filename }, {
                where: {
                    id: req.user.id
                }
            });

            res.status(200).send({
                status: true,
                message: 'Profile picture updated'
            });

        } catch (err) {
            res.status(400).send(err)
        }
    },

};