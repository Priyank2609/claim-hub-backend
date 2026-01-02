const { json } = require("express")
const ClaimModel = require("../models/claim.model")
const PolicyModel = require("../models/policy.model")

module.exports.createClaim = async (req, res) => {
  try {
    const { claimAmount, claimType, policyNo, reason } = req.body

    const claimNumber = Date.now()
    console.log(claimNumber);

    const claimExists = await ClaimModel.findOne({ claimNumber })
    if (claimExists) {
      return res.status(404).json({ message: "Claim is already exists" })

    }
    const policy = await PolicyModel.findOne({ policyNumber: policyNo }).populate({ path: "assignTo" })
    // console.log(policy.assignTo._id.toString() !== req.user.id);
    // console.log(req.user.id);
    if (!policy) {
      return res.status(404).json({ message: "Policy is not Exists for this number" })
    }



    if (policy.assignTo._id.toString() !== req.user.id) {
      return res.status(404).json({ message: "Incorrect policy number" })
    }
    const newClaim = await ClaimModel.create({
      claimAmount, claimNumber, claimType, policyNo, policy: policy, reason, customerID: req.user.id
    })

    res.status(200).json({ message: "Your claim has created", newClaim })

  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }




}
module.exports.getMyClaim = async (req, res) => {

  try {
    const myClaim = await ClaimModel.find({ customerID: req.user.id })
    res.status(200).json({ message: "MyClaim", myClaim })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }

}
module.exports.getAllClaim = async (req, res) => {

  try {

    const getAllClaim = await ClaimModel.find().populate({ path: 'customerID' })

    res.status(200).json({ message: "All claims", getAllClaim })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.getClaimById = async (req, res) => {

  try {
    const claimId = req.params.id

    const claim = await ClaimModel.findById(claimId).populate({ path: 'policy' }).populate({ path: 'customerID' })

    res.status(200).json({ message: "claim", claim })

  } catch (error) {
    res.status(200).json({ message: "Something went wrong", error: error.message })
  }


}

module.exports.getClaimPerCustomer = async (req, res) => {
  console.log(req.user.id);
  try {

    const claim = await ClaimModel.find({ customerID: req.user.id })
    console.log("length", claim.length);


    res.status(200).json({ message: "Claims", claim })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.updateStatus = async (req, res) => {
  try {
    const { status, remark } = req.body

    if (!remark) {
      return res.status(404).json({ message: "First you need to give remark for update status!" })
    }

    const claimById = await ClaimModel.findByIdAndUpdate(req.params.id, { $set: { status, remark: remark } }, { new: true })



    res.status(200).json({ message: "Upadated successfully", claimById })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }


}

module.exports.claimSummary = async (req, res) => {
  try {
    const claims = await ClaimModel.find()




    const totalClaims = claims.length
    // console.log(totalClaims);
    const claimSubmitted = claims.filter((item) => item.status === "Submitted").length
    // console.log("Submmited", claimSubmitted);
    const claimUnderReview = claims.filter((item) => item.status === "Under Review").length
    // console.log("Under Review", claimUnderReview);
    const claimApproved = claims.filter((item) => item.status === 'Approved').length
    // console.log("Approved", claimApproved);

    const claimRejected = claims.filter((item) => item.status === "Rejected").length
    // console.log("Rejected", claimRejectd);

    res.status(200).json({ message: "Summary", totalClaims, claimSubmitted, claimApproved, claimRejected, claimUnderReview })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.claimByMonth = async (req, res) => {
  try {

    const claim = await ClaimModel.find()

    let claimByMonth = {}

    claim.map((claim) => {
      const createdAt = new Date(claim.createdAt)
      const month = createdAt.getMonth()
      const year = createdAt.getFullYear()
      const key = `${year}-${month + 1}`

      if (!claimByMonth[key]) {
        claimByMonth[key] = 0
      }
      claimByMonth[key] += 1
    })

    const result = Object.entries(claimByMonth)
      .sort(([a], [b]) => {
        // console.log(new Date(a))
        // console.log(new Date(b))


        new Date(a) - new Date(b)
      })

      .map(([month, count]) => ({ month, count }));


    res.status(200).json({ message: "Monthly", result })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message })
  }

}


