const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.userLogin = [
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            const response = {
                success: false,
                message: errors.array()
            };

            return res.status(400).json(response);
        } 

        try {
            const uname = req.body.username;
            const pwd = req.body.password;

            const user = await User.findOne({ username: uname }).exec();
            if(!user) {
                const response = {
                    success: false,
                    message: "no such user exists with the username"
                };

                return res.status(401).json(response);
            }

            const match = await bcrypt.compare(pwd, user.password);

            if(!match) {
                const response = {
                    success: false,
                    message: "incorrect password",
                };

                return res.status(401).json(response);
            }

            const response = {
                success: true,
                message: "valid user login successfull"
            };

            res.status(200).json(response);
        } catch (error) {
            const response = {
                success: false,
                message: "Some internal error"
            }

            res.status(500).json(response);
        }
    }
];

exports.userSignup = [
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    body('email').trim().notEmpty(),

    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const response = {
                success: false,
                message: errors.array()
            };

            return res.status(400).json(response);
        }

        try {
            const email = req.body.email;
            const uname = req.body.username;
            const pwd = req.body.password;

            const user = await User.find({ username: uname }).exec();
            console.log(user);
            if(user.length !== 0) {
                const response = {
                    success: false,
                    message: "user already exists with this username",
                };

                return res.status(401).json(response);
            }

            const hashPwd = await bcrypt.hash(pwd, 10);
            const newUser = new User({ username: uname, password: hashPwd, email: email});
            await newUser.save();

            const response = {
                success: true,
                message: "user successfully created",
                username: newUser.username,
                email: newUser.email,
                userId: newUser._id
            };

            return res.status(200).json(response);
        } catch (error) {
            const response = {
                success: false,
            };

            return res.status(500).json(response);
        }
    }
];

exports.forgetPassword = [
    body('username').trim().notEmpty(),
    body('email').trim().notEmpty(),
    body('newPwd').trim().notEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const response = {
                success: false,
                message: errors.array(),
            };

            return res.status(400).json(response);
        }

        const uname = req.body.username;
        const email = req.body.email;
        const newPwd = req.body.newPwd;
        
        try {
            const user = await User.findOne({ username: uname, email: email }).exec();
            if(!user) {
                const response = {
                    success: false,
                    message: "no such user with this username or email",
                };

                return res.status(401).json(response);
            }

            const hashPwd = await bcrypt.hash(newPwd, 10);
            user.password = hashPwd;
            await user.save();

            const response = {
                success: true,
                message: "password successfully updated"
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
            console.log(error);
        }
    }
];