const { default: mongoose } = require("mongoose");


const quoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  },
  message: {
    type: String,
    required: true
  },
  policyType: {
    type: String,
    required: true
  },
  policyId: {
    type: String,

  },
  status: {
    type: String,
    enum: ['Pending', 'Approved'],
    default: 'Pending'
  }

}, {
  timestamps: true
})


const QuoteModel = mongoose.model("QuoteModel", quoteSchema)

module.exports = QuoteModel 