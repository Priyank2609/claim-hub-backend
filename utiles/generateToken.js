const jwt = require('jsonwebtoken')

module.exports.generateToken = (user, res) => {


  const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' })


  res.cookie("Insurance_Token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  })

  return token

}