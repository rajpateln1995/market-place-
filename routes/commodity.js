const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const checkAuth = require('../middlewares/check-auth');
const Commodity = require('../models/commodity')

const multer = require('multer');
const commodity = require('../models/commodity');

const upload = multer({dest : 'uploads/'})


router.get('/' , checkAuth , (req, res, next) => {
    
    Commodity.find({'buyer' : 'NS'}).select('name category price picture buyer seller')
    .exec()
    .then(result => {
        const response = {
            data : result
        }
        res.status
        (200).json(response)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Server Error',
            error: err
        })
    })

})


router.get('/:id' , checkAuth , (req , res , next) => {
    const id = req.params.id;
    commodity.findById(id)
    .exec()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            error : err,
            message: 'No valid Entry found for the ID provided',
        })
    })
})

router.post('/create' , upload.single('image') , checkAuth , (req , res , next) => {
    
    console.log(req.file.path.substring(8))
    const commodity = new Commodity({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        seller: req.userData,
        picture: req.file.path.substring(8) 
    })
    
    
    commodity.save()
    .then(result => {
        res.status(200).json({
            message: 'Commdity created successfully'
        })
    } , err => {
        console.log(err)
        res.status(500).json({
            message: err
        })
    })

})

router.post('/buy' , checkAuth , (req, res , next) => {

    console.log(req.userData)

    const updateProps = {
        buyer: req.userData
    }

    Commodity.updateOne( { _id: req.body.id }, { $set: updateProps } )
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
    
})


router.post('/bought' , checkAuth , (req, res, next) => {
    
    Commodity.find({'buyer.userId' : req.body.id}).select('name category price picture buyer seller')
    .exec()
    .then(result => {
        const response = {
            data : result
        }
        res.status
        (200).json(response)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Server Error',
            error: err
        })
    })

})


router.post('/sold' , checkAuth , (req, res, next) => {
    
    Commodity.find({'seller.userId' : req.body.id}).select('name category price picture buyer seller')
    .exec()
    .then(result => {
        const response = {
            data : result
        }
        res.status
        (200).json(response)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Server Error',
            error: err
        })
    })

})


module.exports = router;