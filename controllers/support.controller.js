const SupportModel = require("../models/support.model");

module.exports.getSupport = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;


    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSupport = await SupportModel.create({
      fullName,
      email,
      subject,
      message,

      createdAt: new Date()
    });


    res.status(201).json({
      message: "Support request submitted successfully",
      support: newSupport
    });
  } catch (error) {
    console.error("Support submission error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};