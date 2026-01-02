const PolicyModel = require("../models/policy.model")
const QuoteModel = require("../models/quote.model")


const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports.createPolicy = async (req, res) => {
  try {
    const quoteId = req.params.id;
    const { policyNumber, policyType, coverageAmount, premium } = req.body;

    if (!quoteId) {
      return res.status(404).json({ message: "Quote ID is not present" });
    }

    const policyExists = await PolicyModel.findOne({ policyNumber });
    if (policyExists) {
      return res.status(404).json({ message: "Policy already exists" });
    }

    // Create policy in DB
    const newPolicy = await PolicyModel.create({
      policyNumber,
      policyType,
      coverageAmount,
      premium
    });

    // Update quote
    const quote = await QuoteModel.findById(quoteId);
    quote.policyId = newPolicy._id;
    quote.status = "Approved";
    await quote.save();

    newPolicy.assignTo = quote.user;
    const startDate = new Date();
    const end = new Date(startDate);
    end.setFullYear(end.getFullYear() + 1);

    newPolicy.startDate = startDate;
    newPolicy.status = 'Active';
    newPolicy.endDate = end;

    await newPolicy.save();

    // ==============================
    // Generate PDF for this policy
    // ==============================
    const policiesDir = path.resolve(__dirname, '../policies');
    if (!fs.existsSync(policiesDir)) fs.mkdirSync(policiesDir, { recursive: true });

    const pdfPath = path.join(policiesDir, `${newPolicy._id}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text('Life Insurance Policy', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Policy Number: ${newPolicy.policyNumber}`);
    doc.text(`Policy Type: ${newPolicy.policyType}`);
    doc.text(`Coverage Amount: ${newPolicy.coverageAmount}`);
    doc.text(`Premium: ${newPolicy.premium}`);
    doc.text(`Start Date: ${newPolicy.startDate}`);
    doc.text(`End Date: ${newPolicy.endDate}`);
    doc.end();
    // ==============================

    res.status(200).json({ message: "Policy is created", newPolicy, pdfPath });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports.getAllPolicy = async (req, res) => {

  try {
    const getAllPolicy = await PolicyModel.find()

    res.status(200).json({ message: "All Polieces", getAllPolicy })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.getPolicyById = async (req, res) => {
  try {
    const polId = req.params.id

    const policyDetail = await PolicyModel.findById(polId).populate({ path: "assignTo" })
    const date = new Date()

    if (date > policyDetail.endDate) {
      policyDetail.status = 'Expired'
      await policyDetail.save()
    }


    res.status(200).json({ message: "Policy Detailed", policyDetail })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// module.exports.assginPolicy = async (req, res) => {
//   try {

//     const polId = req.params.id

//     const { userId } = req.body
//     const policy = await PolicyModel.findById(polId)

//     policy.assignTo = userId

//     const startDate = new Date()
//     const end = new Date(startDate)
//     end.setFullYear(end.getFullYear() + 1)

//     policy.startDate = startDate
//     policy.status = 'Active'
//     policy.endDate = end
//     await policy.save()

//     res.status(200).json({ message: "Policy is assign", policy })
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong", error: error.message })

//   }

// }

module.exports.updatePolicy = async (req, res) => {
  try {
    const { policyType, coverageAmount, premium } = req.body


    if (!policyType || !coverageAmount || !premium) {
      return res.status(400).json({ message: "At least one field must be provided to update" });
    }

    const updatePolicy = await PolicyModel.findByIdAndUpdate(req.params.id, { $set: { policyType, coverageAmount, premium } }, { new: true })

    res.status(200).json({ message: "Updated successfully", updatePolicy })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}


module.exports.countPolicy = async (req, res) => {

  try {
    const policy = await PolicyModel.find()

    const totalPolices = policy.length
    console.log(totalPolices);
    res.status(200).json({ message: "All count", totalPolices })
  } catch (error) {
    res.status(500).jdon({ message: "Something went wrong", error: error.message })
  }

}

module.exports.getMyPolicy = async (req, res) => {

  try {
    const myPolicies = await PolicyModel.find({ assignTo: req.user.id })
    res.status(200).json({ message: "MyPolices", myPolicies })

  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }
}


module.exports.policyDownload = async (req, res) => {
  const policyId = req.params.policyId;

  const policiesDir = path.resolve(__dirname, '../policies');
  const filePath = path.join(policiesDir, `${policyId}.pdf`);

  // Debug: list files in the folder
  console.log('Available files:', fs.existsSync(policiesDir) ? fs.readdirSync(policiesDir) : 'Folder not found');

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return res.status(404).send('File not found');
  }

  res.download(filePath, `LifePolicy-${policyId}.pdf`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error downloading file');
    }
  });
};



