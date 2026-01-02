module.exports.authRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Not Authorized" })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: "You Don't Have Access" })
    }
    next()
  }
}