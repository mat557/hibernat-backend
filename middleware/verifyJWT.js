

const verifyJWT = async(req,res,next) => {
    console.log(req.headers.authorization)
    console.log(req.header)
    console.log('clicked')
    next()
}

module.exports = verifyJWT