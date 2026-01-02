const { findById } = require("../models/claim.model")
const UserModel = require("../models/user.model")
const { generateToken } = require("../utiles/generateToken")

module.exports.register = async (req, res) => {

  try {
    const { email, password, userName, role, dateOfBirth, gender, maritalStatus, address, phone } = req.body

    const userExists = await UserModel.findOne({ email: email })

    if (userExists) {
      return res.status(404).json({ message: "User is already exists" })
    }
    // console.log(password.length);
    // console.log(password.length < 6);
    const phoneExists = await UserModel.findOne({ phone });
    if (phoneExists) {
      return res.status(409).json({ message: "User already exists with this phone number" });
    }

    if (password.length < 6) {
      return res.status(404).json({ message: "Password is to small" })
    }

    const newUser = await UserModel.create({
      email,
      password,
      userName,
      role,
      dateOfBirth,
      gender,
      maritalStatus,
      address,
      phone
    })


    res.status(200).json({ message: 'User is register', newUser })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}
module.exports.getAllUser = async (req, res) => {
  try {

    const users = await UserModel.find()

    res.status(200).json({ message: "All Users", users })
  } catch (error) {

  }

}

module.exports.userDetail = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await UserModel.findById(userId)

    res.status(200).json({ message: "User Detail", user })

  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }
}



module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailExists = await UserModel.findOne({ email })
    if (!emailExists) {
      return res.status(404).json({ message: "Email is not exists" })
    }
    // console.log(password);


    const checkPassword = await emailExists.passwordCheck(password)
    // console.log(checkPassword);

    if (!checkPassword) {
      return res.status(404).json({ message: 'Password is Invalid' })
    }

    const token = await generateToken(emailExists, res)
    // console.log(token);

    res.status(200).json({ message: 'Login successfully', token, emailExists })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.logout = async (req, res) => {
  try {
    res.cookie('Insurance_Token', '', {

      httpOnly: true,
      expires: new Date(0)
    }

    )
    res.status(200).json({ message: "Logout successfully" })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.changePassword = async (req, res) => {

  try {
    const { password, newPassword, confirmPassword } = req.body

    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await UserModel.findById(req.user.id)

    const checkPassword = await user.passwordCheck(password)

    if (!checkPassword) {
      return res.status(404).json({ message: 'OldPassword is Invalid' })
    }
    if (password === newPassword) {
      return res.status(404).json({ message: 'New password is not to be simialr as previous' })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }



    user.password = newPassword
    await user.save()
    res.status(200).json({ message: "Password updated" })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }
}