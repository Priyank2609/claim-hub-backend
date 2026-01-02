const { default: mongoose } = require("mongoose");

const policySchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    required: true
  },
  policyType: {
    type: String,
    required: true,
    enum: ['Life', 'Health', 'Vehicle', 'Home', "Business", "Travel"],
  },
  coverageAmount: {
    type: String,
    required: true,

  },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  },
  status: {
    type: String,
    enum: ['Null', 'Active', 'Expired'],
    default: 'Null'
  },
  premium: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    // required: true,
  },
  endDate: {
    type: Date,
    // required: true,

  },

}, { timestamps: true })





const PolicyModel = mongoose.model("PolicyModel", policySchema)



module.exports = PolicyModel