const { default: mongoose } = require("mongoose");

const claimSchema = new mongoose.Schema({
  claimNumber: {
    type: String,
    required: true
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PolicyModel"
  },
  policyNo: {
    type: String,
    required: true
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  reason: {
    type: String,
    required: true
  },
  remark: {
    type: String,
    // required: true
  },
  claimType: {
    type: String,
    required: true,
    enum: ['Accident', 'Theft', 'Natural Disaster', 'Other'],
  },
  claimAmount: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Rejected', 'Under Review', "Submitted"],
    default: 'Submitted'
  },

  claimDate: {
    type: Date,
    default: Date.now()
  }

}, { timestamps: true })

const ClaimModel = mongoose.model("ClaimModel", claimSchema)

module.exports = ClaimModel