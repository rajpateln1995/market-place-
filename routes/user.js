const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup' , (req, res ,next) => {
    
    bcrypt.hash(req.body.password , 10 , (err, hash) => {
        if(err) {
            return res.status(500).json({
                error : err
            })
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                name: req.body.name,
            })

            user.save()
            .then(result => {

                User.find({email : req.body.email}).exec()
                .then(user => {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id,
                        name: user[0].name
                    } , process.env.JWT_KEY,
                    {
                        expiresIn: "10h",
    
                    })

                    res.status(201).json({
                        message: 'user Created',
                        token: token,
                        user: user[0]
                    })

                })

                
            })
            .catch(err => {
                res.status(500).json({
                    message: err
                })
            })
        }
    });

})



router.post('/login' , (req, res, next) => {
    
    User.find({email : req.body.email}).exec()
    .then(user => {
        if (user.length < 1){
            return res.status(404).json({
                message: 'User does not exist'
            }) 
        } else {
            bcrypt.compare(req.body.password , user[0].password , (err , result) => {
                if (err) {
                    return res.status(401).json({
                        message:'Password incorrect'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id,
                        name: user[0].name
                    } , process.env.JWT_KEY,
                    {
                        expiresIn: "10h",

                    })
                    return res.status(200).json({
                        token: token,
                        message: 'Authentication successfull',
                        user: user[0]
                    })
                }

                return res.status(400).json({
                    message: 'Authentication failed'
                })
            })
        }
    }

    )
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router