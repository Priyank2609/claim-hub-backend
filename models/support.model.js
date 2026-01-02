const { default: mongoose } = require("mongoose");


const supportSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})



const SupportModel = mongoose.model("SupportModel", supportSchema)


module.exports = SupportModel