const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    try {
        console.log(req.headers.authorization)
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1] , process.env.JWT_KEY)
        console.log(decoded)
        req.userData = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message : 'Authentication failed',
            error: err
        })
    }
}