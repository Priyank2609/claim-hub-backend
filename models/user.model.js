const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Admin", "Customer", "Agent", "Claim Officer"]
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married"]
  },
  phone: {
    type: Number,
    required: true
  },

  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String }
  },
}, {
  timestamps: true

})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()

  this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.passwordCheck = async function (password) {
  return await bcrypt.compare(password, this.password)
}



const UserModel = mongoose.model("UserModel", userSchema)


module.exports = UserModel