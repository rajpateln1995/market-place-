const express = require('express')

const morgan = require('morgan');
var bodyParser = require('body-parser')
const app = express()

const mongoose = require('mongoose');

const userRoutes = require('./routes/user')
const commodityRoutes = require('./routes/commodity')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(morgan('dev'));

mongoose.connect('mongodb+srv://raj_2303:' + process.env.MONGO_ATLAS_PW + '@cluster0.bv37v.mongodb.net/assignment_capital?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use((req , res , next) => {
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Headers' , 'Origin , X-Requested-With , Content-Type , Accept , Authorization');
    res.header('Access-Control-Allow-Methods' , 'PUT , POST , GET , PATCH , DELETE');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods' , 'PUT , POST , GET , PATCH , DELETE');
        return res.status(200).json();
    }
    next();
});

app.use("/frontend" , express.static('fontend/capitall-frontend/dist/capitall-frontend'))
app.use("/commodity", commodityRoutes)
app.use("/users", userRoutes)

app.use(express.static('uploads'))

app.use((req , res , next) => {
    const err = new Error('Not Found');
    err.status = 400;
    next(err);
})

app.use((error , req , res , next) => {
    res.status(error.status || 500);
    console.log(error);
    res.json({
        message : error.message,

    })
})


module.exports = app