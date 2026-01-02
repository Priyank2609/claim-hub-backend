const QuoteModel = require("../models/quote.model")

module.exports.createQuote = async (req, res) => {
  try {

    const { message, policyType } = req.body

    const newQuote = await QuoteModel.create({
      message, policyType, user: req.user.id
    })


    res.status(200).json({ message: "Quote is created", newQuote })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.getAllQuotes = async (req, res) => {

  try {
    const quotes = await QuoteModel.find()

    res.status(200).json({ message: "Quotes", quotes })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }

}