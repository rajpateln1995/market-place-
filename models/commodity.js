const mongoose = require('mongoose');

const commoditySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String , required: true },
    category: { type: String , required: true },
    price: { type: String , required: true },
    picture : { type: String , required: true },
    buyer : { type: Object , default : "NS" },
    seller : { type: Object , require: true}
});

module.exports = mongoose.model('commodity' , commoditySchema)

