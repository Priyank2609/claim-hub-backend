const jwt = require("jsonwebtoken");


module.exports.protect = (req, res, next) => {

  let token
  token = req.cookies.Insurance_Token
  console.log('Cookies:', req.cookies.Insurance_Token);
  if (!token) {
    return res.status(401).json({ message: "UnAuthorized Token" })
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY)
  req.user = decoded
  console.log("req.user:", req.user);
  next()


}