const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email)
}

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String , required: true },
    email: { type: String , required: 'Email address is required', unique: true , validate: [validateEmail, 'Please fill a valid email address'] },
    password: { type: String , required: true },
    items_on_sale: { type: String , required: false },
    purchased_items: { type: String , required: false },
});


module.exports = mongoose.model('user' , userSchema)